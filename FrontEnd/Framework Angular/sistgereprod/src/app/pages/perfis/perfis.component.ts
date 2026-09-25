import { AuthService } from '../../services/auth.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { ModalComponent } from '../../components/modal/modal.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import { Common } from '../../shared/common';
import { firstValueFrom } from 'rxjs';
import { PerfilService } from '../../services/perfil.service';
import { Perfil } from '../../model/perfil';

@Component({
  selector: 'app-perfis',
  imports: [SidebarComponent],
  templateUrl: './perfis.component.html',
  styleUrl: './perfis.component.css',  
})

export class PerfisComponent implements OnInit{

  public perfisData:Perfil[] = [];
  public perfil: Perfil = new Perfil();
  public isHandset:boolean = false;
  public isLoading: boolean = true; 
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;
 

  public modalRef?: BsModalRef;

  constructor(private authService: AuthService,
    private modalService: BsModalService,  
    private perfilService:PerfilService,
    private common:Common
  ){
  }

  async ngOnInit():Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.isHandset = true     
  
      await this.loadPerfis();
    }
  }

  async loadPerfis(): Promise<void> {    
    this.isLoading = true;
    try {
      const perfisData = await firstValueFrom(this.perfilService.getPerfis());
      this.perfisData = perfisData ?? [];

      if (this.perfisData.length === 0) {
        this.common.toast('Nenhum perfil cadastrado.', 'info');
      }
    } catch (error: any) {
      this.common.toast(`Erro ao carregar perfis, motivo: ${error.message}`, 'error');
      this.perfisData = [];
    } finally {
      this.isLoading = false;   // 👈 Angular cuida do *ngIf sozinho, sem tocar no DOM
    }
  }



  async openPerfilModal(id?: number) {

    try {
      //this.perfil = this.perfisData.find(x => x.id === id) ?? new Perfil();
      if(id)     
        this.perfil = await firstValueFrom(this.perfilService.getPerfilId(id!));     
     

      this.modalRef = this.modalService.show(ModalComponent, {
        initialState: {},
        keyboard: false,
        ignoreBackdropClick: true,
      });
    
      this.modalRef.content.openModal(id ? 'Editar Perfil' : 'Novo Perfil', `
        <div class="form-grid one-col">
          <div class="form-group"><label>Descrição do Perfil *</label><input id="f-p-desc" value="${this.perfil?.descricaoPerfil || ''}" placeholder="ex: Administrador, Operador..."></div>
        </div>`,
        `<button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" id="modal-save">${id ? 'Salvar' : 'Criar Perfil'}</button>`
      );

      // Anexa os listeners depois que o HTML foi inserido no DOM
      setTimeout(() => {
        document.getElementById('modal-cancel')?.addEventListener('click', () => {
          this.modalRef?.content.closeModal();
        });

        document.getElementById('modal-save')?.addEventListener('click', () => {          
          const perfilForm = new Perfil(this.perfil?.id ,       
            (document.getElementById('f-p-desc') as HTMLInputElement)?.value?.trim() || '',
          );

          this.savePerfil(id || 0, perfilForm);
          this.modalRef?.content.closeModal();
        });
      });

    } catch (error) {
      this.common.toast('Erro ao carregar dados para o modal.', 'error');
    }
  }

  savePerfil(id:number, perfil:Perfil) {
    const body = new Perfil(
      perfil.id,     
      perfil.descricaoPerfil.trim(),    
    );    
    if (!body.descricaoPerfil) { 
      this.common.toast('Descrição do perfil é obrigatória.', 'error'); 
      return; 
    }

    if (id){ 
        this.perfilService.updatePerfil(id, body).subscribe({
        next: (response: Perfil) => {       
            this.common.toast('Perfil atualizado!','success');
            this.loadPerfis();
        },
        error: (e) => {      
          this.common.toast(e.response?.data || 'Erro ao salvar perfil.', 'error'); 
        }
    
      });
    }else{ 
      this.perfilService.addPerfil(body).subscribe({
        next: (response: Perfil) => {                 
            this.common.toast('Perfil criado!','success');
            this.loadPerfis();
        },
        error: (error) => {          
          this.common.toast(error.response?.data || 'Erro ao salvar perfil.', 'error'); 
        }
    
      });
    }      
    
  }

  async deletePerfil(id:number, nome:string) {
    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
      },
      keyboard: false,
      ignoreBackdropClick: true,
    });

    // Chama o método no componente do modal após abrir   

    if (!await this.modalRef?.content?.confirmDialog('Excluir perfil?', `"${nome}" será removido permanentemente.`))
      return;    

    this.perfilService.deletePerfil(id).subscribe({
      next: () => {
        this.common.toast('Perfil excluído.','success'); 
        this.modalRef?.onHidden?.subscribe(() => {
          console.log('Modal fechou!');
        });
        this.loadPerfis();
      },
      error: (error) => {          
        this.common.toast('Erro ao excluir perfil.', 'error'); 
      }
    });  
    
  }

  async  gerarRelatorio() {

    this.perfilService.getRelatorioPdf().subscribe({
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
    if(event && this.perfisData){ 
      const q = (event.target as HTMLInputElement).value.toLowerCase(); 
      if (!q){
        this.loadPerfis()
      }else{   
        this.perfisData = this.perfisData?.filter(p =>
          (p.descricaoPerfil || '').toLowerCase().includes(q)     
        );
      }
    }   
  }
  

}