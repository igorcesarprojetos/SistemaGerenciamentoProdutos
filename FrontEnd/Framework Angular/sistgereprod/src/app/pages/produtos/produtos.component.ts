import { CategoriaService } from './../../services/categoria.service';
import { ProdutoService } from './../../services/produto.service';
import { AuthService } from './../../services/auth.service';
import {Component, OnInit, ViewChild } from "@angular/core";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { Produto } from "../../model/produto";
import { ModalComponent } from '../../components/modal/modal.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import { Common } from '../../shared/common';
import { firstValueFrom } from 'rxjs';
import {CommonModule, CurrencyPipe} from "@angular/common";
import { Categoria } from '../../model/categoria';

@Component({
  selector: 'app-produtos',
  imports: [SidebarComponent, CurrencyPipe, CommonModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css',  
})

export class ProdutosComponent implements OnInit{

  public produtosData:Produto[] = [];
  public produtosFiltrados:Produto[]= this.produtosData;
  public produto: Produto = new Produto();
  public categoriasData:Categoria[] = [];
  public isHandset:boolean = false;
  public isLoading: boolean = true; 
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;
 

  public modalRef?: BsModalRef;

  constructor(private authService: AuthService,
    private modalService: BsModalService,
    private produtoService:ProdutoService,
    private categoriaService: CategoriaService,
    private common:Common
  ){
  }

  async ngOnInit():Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.isHandset = true     
  
      await this.loadProdutos()

      console.log('produtos recebidos:', JSON.stringify(this.produtosData));
    }
  }

  async loadProdutos(): Promise<void> {
    this.isLoading = true;
    try {
      const produtosData = await firstValueFrom(this.produtoService.getProdutos());
      this.produtosData = produtosData ?? [];

      if (this.produtosData.length === 0) {
        this.common.toast('Nenhum produto cadastrado.', 'info');
      }
    } catch (error: any) {
      this.common.toast(`Erro ao carregar produtos, motivo: ${error.message}`, 'error');
      this.produtosData = [];
    } finally {
      this.isLoading = false;   // 👈 Angular cuida do *ngIf sozinho, sem tocar no DOM
    }
  }



  async openProdutoModal(id?: number) {
    this.produto = this.produtosData.find(x => x.id === id) ?? new Produto();

     await firstValueFrom(this.categoriaService.getCategorias())
        .then((categorias)=>{
        this.categoriasData = categorias;
        })
        .catch((error) => {
          this.common.toast('Erro ao carregar categorias.', 'error');
        })

    const categorias = (this.categoriasData || []).map(c => `<option value="${c.id}" ${((c.id) === (this.produto.categoriaId)) ? 'selected' : ''}>${c.descricao}</option>`).join('');      

    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {},
      keyboard: false,
      ignoreBackdropClick: true,
    });
    // <div class="form-group"><label>Valor</label><input id="f-valor" type="number" step="0.01" value="${this.produto?.preco ?? 0}"></div>
    this.modalRef.content.openModal(
      id ? 'Editar Produto' : 'Novo Produto',
      `
        <div class="form-grid">
          <div class="form-group"><label>Código</label><input id="f-codigo" type="number" value="${this.produto?.codigo ?? ''}"></div>
          <div class="form-group"><label>Nome *</label><input id="f-nome" value="${this.produto?.nome ?? ''}"></div>
          <div class="form-group full"><label>Descrição</label><textarea id="f-descricao">${this.produto?.descricao ?? ''}</textarea></div>
          <div class="form-group"><label>Marca</label><input id="f-marca" value="${this.produto?.marca ?? ''}"></div>         
          <div class="form-group"><label>Categoria</label><select id="f-categoria"><option value="">—</option>${categorias}</select></div>
          <div class="form-group"><label>Quantidade em Estoque</label><input id="f-estoque" type="number" value="${this.produto?.quantidadeEstoque ?? 0}"></div>
          <div class="form-group"><label>Valor</label><input id="f-valor" type="number" value="${this.produto?.preco ?? 0.00}"></div>
        </div>`,
      `<button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-save">${id ? 'Salvar' : 'Criar Produto'}</button>`
    );

    // Anexa os listeners depois que o HTML foi inserido no DOM
    setTimeout(() => {
      document.getElementById('modal-cancel')?.addEventListener('click', () => {
        this.modalRef?.content.closeModal();
      });

      document.getElementById('modal-save')?.addEventListener('click', () => {
        const produtoForm = new Produto({
          codigo: Number((document.getElementById('f-codigo') as HTMLInputElement)?.value) || 0,
          nome: (document.getElementById('f-nome') as HTMLInputElement)?.value?.trim() || '',
          descricao: (document.getElementById('f-descricao') as HTMLTextAreaElement)?.value?.trim() || '',
          marca: (document.getElementById('f-marca') as HTMLInputElement)?.value?.trim() || '',       
          categoriaId: Number((document.getElementById('f-categoria') as HTMLSelectElement)?.value) || 0,
          quantidadeEstoque: Number((document.getElementById('f-estoque') as HTMLInputElement)?.value) || 0,
          preco: Number((document.getElementById('f-valor') as HTMLInputElement)?.value) || 0.00,
        });

        this.saveProduto(id || 0, produtoForm);
        this.modalRef?.content.closeModal();
      });
    });
  }

  saveProduto(id:number, produto:Produto) {
    const body = new Produto({
      codigo: produto?.codigo || 0,
      nome: produto?.nome?.trim() || '',
      descricao: produto?.descricao?.trim() || '',
      marca: produto?.marca?.trim() || '',
      categoriaId: produto?.categoriaId || 0,
      quantidadeEstoque: produto?.quantidadeEstoque || 0,
      preco: produto?.preco || 0.00,
    });    
    if (!body.nome) { 
      this.common.toast('Nome é obrigatório.', 'error'); 
      return; 
    }

    if (id){ 
        this.produtoService.updateProduto(id, body).subscribe({
        next: (response: Produto) => {       
            this.common.toast('Produto atualizado!','success');
            this.loadProdutos();
        },
        error: (e) => {      
          this.common.toast(e.response?.data || 'Erro ao salvar produto.', 'error'); 
        }
    
      });
    }else{ 
      this.produtoService.addProduto(body).subscribe({
        next: (response: Produto) => {                 
            this.common.toast('Produto criado!','success');
            this.loadProdutos();
        },
        error: (error) => {          
          this.common.toast(error.response?.data || 'Erro ao salvar produto.', 'error'); 
        }
    
      });
    }      
    
  }

  async deleteProduto(id:number, nome:string) {
    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
      },
      keyboard: false,
      ignoreBackdropClick: true,
    });

    // Chama o método no componente do modal após abrir   

    if (!await this.modalRef?.content?.confirmDialog('Excluir produto?', `"${nome}" será removido permanentemente.`))
      return;    

    this.produtoService.deleteProduto(id).subscribe({
      next: () => {
        this.common.toast('Produto excluído.','success'); 
        this.modalRef?.onHidden?.subscribe(() => {
          console.log('Modal fechou!');
        });
        this.loadProdutos();
      },
      error: (error) => {          
        this.common.toast('Erro ao excluir produto.', 'error'); 
      }
    });  
    
  }


  async  gerarRelatorio() {

    this.produtoService.getRelatorioPdf().subscribe({
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
    if(event && this.produtosData){ 
      const q = (event.target as HTMLInputElement).value.toLowerCase(); 
      if (!q){
        this.loadProdutos()
      }else{   
        this.produtosData = this.produtosData?.filter(p =>
          (p.nome || '').toLowerCase().includes(q) ||
          (p.marca || '').toLowerCase().includes(q) ||
          (
            (this.categoriasData || []).map(c => { 
              if (c!=null) {
                p.categoria = c;
                (p.categoria?.descricao || '').toLowerCase().includes(q); 
              }           
            })
          ),
                
        );
      }
    }   
  }
  

}