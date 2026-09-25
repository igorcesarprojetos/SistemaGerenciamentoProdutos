import { ProdutoService } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';
import {Component, OnInit, ViewChild } from "@angular/core";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { Produto } from "../../model/produto";
import { ModalComponent } from '../../components/modal/modal.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import { Common } from '../../shared/common';
import { firstValueFrom } from 'rxjs';
import {CommonModule} from "@angular/common";
import { Categoria } from '../../model/categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',  
})

export class CategoriasComponent implements OnInit{

  public categoriasData:Categoria[] = [];
  public categoriasFiltrados:Categoria[]= this.categoriasData;
  public categoria: Categoria = new Categoria();
  public isHandset:boolean = false;
  public isLoading: boolean = true; 
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;
 

  public modalRef?: BsModalRef;

  constructor(private authService: AuthService,
    private modalService: BsModalService,
    private categoriaService: CategoriaService,
    private common:Common
  ){
  }

  async ngOnInit():Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.isHandset = true     
  
      await this.loadCategorias()

      console.log('categorias recebidas:', JSON.stringify(this.categoriasData));
    }
  }

  async loadCategorias(): Promise<void> {
    this.isLoading = true;
    try {
      const categoriasData = await firstValueFrom(this.categoriaService.getCategorias());
      this.categoriasData = categoriasData ?? [];

      if (this.categoriasData.length === 0) {
        this.common.toast('Nenhuma categoria cadastrada.', 'info');
      }
    } catch (error: any) {
      this.common.toast(`Erro ao carregar categorias, motivo: ${error.message}`, 'error');
      this.categoriasData = [];
    } finally {
      this.isLoading = false;   // 👈 Angular cuida do *ngIf sozinho, sem tocar no DOM
    }
  }



  openCategoriaModal(id?: number) {
    this.categoria = this.categoriasData.find(x => x.id === id) ?? new Categoria();

    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {},
      keyboard: false,
      ignoreBackdropClick: true,
    });
    
    this.modalRef.content.openModal(
      id ? 'Editar Categoria' : 'Nova Categoria',
      `
        <div class="form-grid">
          <div class="form-group"><label>Descrição *</label><input id="f-descricao" value="${this.categoria?.descricao ?? ''}"></div>
        </div>`,
      `<button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-save">${id ? 'Salvar' : 'Criar Categoria'}</button>`
    );

    // Anexa os listeners depois que o HTML foi inserido no DOM
    setTimeout(() => {
      document.getElementById('modal-cancel')?.addEventListener('click', () => {
        this.modalRef?.content.closeModal();
      });

      document.getElementById('modal-save')?.addEventListener('click', () => {
        const categoriaForm = new Categoria({        
          descricao: (document.getElementById('f-descricao') as HTMLTextAreaElement)?.value?.trim() || '',
        });

        this.saveCategoria(id || 0, categoriaForm);
        this.modalRef?.content.closeModal();
      });
    });
  }

  saveCategoria(id:number, categoria:Categoria) {
    const body = new Categoria({   
      descricao: categoria?.descricao?.trim() || '',
    });    
    if (!body.descricao) { 
      this.common.toast('Descrição é obrigatória.', 'error'); 
      return; 
    }

    if (id){ 
        this.categoriaService.updateCategoria(id, body).subscribe({
        next: (response: Categoria) => {       
            this.common.toast('Categoria atualizada!','success');
            this.loadCategorias();
        },
        error: (e) => {      
          this.common.toast(e.response?.data || 'Erro ao salvar categoria.', 'error'); 
        }
    
      });
    }else{ 
      this.categoriaService.addCategoria(body).subscribe({
        next: (response: Categoria) => {                 
            this.common.toast('Categoria criada!','success');
            this.loadCategorias();
        },
        error: (error) => {          
          this.common.toast(error.response?.data || 'Erro ao salvar categoria.', 'error'); 
        }
    
      });
    }      
    
  }

  async deleteCategoria(id:number, nome:string) {
    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
      },
      keyboard: false,
      ignoreBackdropClick: true,
    });

    // Chama o método no componente do modal após abrir   

    if (!await this.modalRef?.content?.confirmDialog('Excluir categoria?', `"${nome}" será removida permanentemente.`))
      return;    

    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => {
        this.common.toast('Categoria excluída.','success'); 
        this.modalRef?.onHidden?.subscribe(() => {
          console.log('Modal fechou!');
        });
        this.loadCategorias();
      },
      error: (error) => {          
        this.common.toast('Erro ao excluir categoria.', 'error'); 
      }
    });  
    
  }


  async  gerarRelatorio() {

    this.categoriaService.getRelatorioPdf().subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));      
          window.open(url, '_blank');        
        },
        error: (error) => {
          this.common.toast('Erro ao gerar relatório.', error);     
        }
      })
  }

  filtrar(event: Event): void {
    if(event && this.categoriasData){ 
      const q = (event.target as HTMLInputElement).value.toLowerCase(); 
      if (!q){
        this.loadCategorias()
      }else{   
        this.categoriasData = this.categoriasData?.filter(p =>
          (p.descricao || '').toLowerCase().includes(q)      
        );
      }
    }   
  }
  

}