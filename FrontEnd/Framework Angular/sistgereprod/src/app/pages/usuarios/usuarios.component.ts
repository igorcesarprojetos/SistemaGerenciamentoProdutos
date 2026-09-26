import { AuthService } from '../../services/auth.service';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { ModalComponent } from '../../components/modal/modal.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import { Common } from '../../shared/common';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { EmpresaService } from '../../services/empresa.service';
import { PerfilService } from '../../services/perfil.service';
import { Empresa } from '../../model/empresa';
import { Perfil } from '../../model/perfil';

@Component({
  selector: 'app-usuarios',
  imports: [SidebarComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',  
})

export class UsuariosComponent implements OnInit{

  public usuariosData:Usuario[] = [];
  public empresasData:Empresa[] = [];
  public perfisData:Perfil[] = [];
  public usuario: Usuario = new Usuario();
  public isHandset:boolean = false;
  public isLoading: boolean = true; 
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;
 

  public modalRef?: BsModalRef;

  constructor(private authService: AuthService,
    private modalService: BsModalService,
    private usuarioService:UsuarioService,
    private empresaService:EmpresaService,
    private perfilService:PerfilService,
    private common:Common
  ){
  }

  async ngOnInit():Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.isHandset = true     
  
      await this.loadUsuarios();
    }
  }

  async loadUsuarios(): Promise<void> {    
    this.isLoading = true;
    try {
      const usuariosData = await firstValueFrom(this.usuarioService.getUsuarios());
      this.usuariosData = usuariosData ?? [];

      if (this.usuariosData.length === 0) {
        this.common.toast('Nenhum usuário cadastrado.', 'info');
      }
    } catch (error: any) {
      this.common.toast(`Erro ao carregar usuários, motivo: ${error.message}`, 'error');
      this.usuariosData = [];
    } finally {
      this.isLoading = false;   // 👈 Angular cuida do *ngIf sozinho, sem tocar no DOM
    }
  }



  async openUsuarioModal(id?: number) {

    try {
      this.usuario = this.usuariosData.find(x => x.id === id) ?? new Usuario();

      await firstValueFrom(this.empresaService.getEmpresas())
        .then((empresas)=>{
        this.empresasData = empresas;
        })
        .catch((error) => {
          this.common.toast('Erro ao carregar empresas.', 'error');
        })      

      await firstValueFrom(this.perfilService.getPerfis())
        .then((perfis)=>{
        this.perfisData = perfis;
        })
        .catch((error) => {
          this.common.toast('Erro ao carregar perfis.', 'error');
        })
      
      const empresa = (this.empresasData || []).map(e => `<option value="${e.id}" ${((e.id) === (this.usuario.empresaId)) ? 'selected' : ''}>${e.nomeFantasia}</option>`).join('');
      const perfis = (this.perfisData || []).map(p => `<option value="${p.id}" ${((p.id) === (this.usuario.perfilId)) ? 'selected' : ''}>${p.descricaoPerfil}</option>`).join('');

      this.modalRef = this.modalService.show(ModalComponent, {
        initialState: {},
        keyboard: false,
        ignoreBackdropClick: true,
      });
    
      this.modalRef.content.openModal(
        id ? 'Editar Usuário' : 'Novo Usuário',
        `<div class="form-grid">
          <div class="form-group full"><label>Nome *</label><input id="f-u-nome" value="${this.usuario?.nome || ''}"></div>
          <div class="form-group"><label>Login *</label><input id="f-u-login" value="${this.usuario?.login || ''}"></div>
          <div class="form-group"><label>Senha ${id ? '(deixe vazio para não alterar)' : ' *'}</label><input id="f-u-senha" type="password"></div>
          <div class="form-group full"><label>E-mail</label><input id="f-u-email" type="email" value="${this.usuario?.email || ''}"></div>
          <div class="form-group"><label>Empresa</label><select id="f-u-empresa"><option value="">—</option>${empresa}</select></div>
          <div class="form-group"><label>Perfil</label><select id="f-u-perfil"><option value="">—</option>${perfis}</select></div>
          <div class="form-group"><label>Status</label>
            <select id="f-u-ativo"><option value="true" ${(this.usuario?.indAtivo) ? 'selected' : ''}>Ativo</option><option value="false" ${!(this.usuario?.indAtivo) ? 'selected' : ''}>Inativo</option></select>
          </div>
        </div>`,
        `<button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" id="modal-save">${id ? 'Salvar' : 'Criar Usuário'}</button>`
      );

      // Anexa os listeners depois que o HTML foi inserido no DOM
      setTimeout(() => {
        document.getElementById('modal-cancel')?.addEventListener('click', () => {
          this.modalRef?.content.closeModal();
        });

        document.getElementById('modal-save')?.addEventListener('click', () => {
          const usuarioForm = new Usuario({        
            nome: (document.getElementById('f-u-nome') as HTMLInputElement)?.value?.trim() || '',
            login: (document.getElementById('f-u-login') as HTMLInputElement)?.value?.trim() || '',
            senha:  (document.getElementById('f-u-senha') as HTMLInputElement)?.value?.trim() || this.usuario?.senha,
            email: (document.getElementById('f-u-email') as HTMLInputElement)?.value?.trim() || '',
            empresaId: Number((document.getElementById('f-u-empresa') as HTMLSelectElement)?.value) || 0,
            perfilId: Number((document.getElementById('f-u-perfil') as HTMLSelectElement)?.value) || 0,
            indAtivo: (document.getElementById('f-u-ativo') as HTMLSelectElement)?.value === 'true',       
          });

          if (!usuarioForm.senha.length) {
            this.common.toast('Senha é obrigatória.', 'error');
            return;
          }
          this.saveUsuario(id || 0, usuarioForm);
          this.modalRef?.content.closeModal();
        });
      });

    } catch (error) {
      this.common.toast('Erro ao carregar dados para o modal.', 'error');
    }
  }

  saveUsuario(id:number, usuario:Usuario) {
    const body = new Usuario({      
      nome: usuario?.nome?.trim() || '',
      login: usuario?.login?.trim() || '',
      email: usuario?.email?.trim() || '',
      senha: usuario?.senha?.trim() || '',
      empresaId: usuario?.empresaId || 0,
      perfilId: usuario?.perfilId || 0,
      indAtivo: usuario?.indAtivo || false,        
    });    
    if (!body.nome) { 
      this.common.toast('Nome é obrigatório.', 'error'); 
      return; 
    }

    if (id){ 
        this.usuarioService.updateUsuario(id, body).subscribe({
        next: (response: Usuario) => {       
            this.common.toast('Usuário atualizado!','success');
            this.loadUsuarios();
        },
        error: (e) => {      
          this.common.toast(e.response?.data || 'Erro ao salvar usuário.', 'error'); 
        }
    
      });
    }else{ 
      this.usuarioService.addUsuario(body).subscribe({
        next: (response: Usuario) => {                 
            this.common.toast('Usuário criado!','success');
            this.loadUsuarios();
        },
        error: (error) => {          
          this.common.toast(error.response?.data || 'Erro ao salvar usuário.', 'error'); 
        }
    
      });
    }      
    
  }

  async deleteUsuario(id:number, nome:string) {
    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
      },
      keyboard: false,
      ignoreBackdropClick: true,
    });

    // Chama o método no componente do modal após abrir   

    if (!await this.modalRef?.content?.confirmDialog('Excluir usuário?', `"${nome}" será removido permanentemente.`))
      return;    

    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.common.toast('Usuário excluído.','success'); 
        this.modalRef?.onHidden?.subscribe(() => {
          console.log('Modal fechou!');
        });
        this.loadUsuarios();
      },
      error: (error) => {          
        this.common.toast('Erro ao excluir usuário.', 'error'); 
      }
    });  
    
  }

  async  gerarRelatorio() {

    this.usuarioService.getRelatorioPdf().subscribe({
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
    if(event && this.usuariosData){ 
      const q = (event.target as HTMLInputElement).value.toLowerCase(); 
      if (!q){
        this.loadUsuarios()
      }else{   
        this.usuariosData = this.usuariosData?.filter(u =>
          (u.nome || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)     
        );
      }
    }
  }
  

}