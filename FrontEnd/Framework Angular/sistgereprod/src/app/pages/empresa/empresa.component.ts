import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Empresa } from "../../model/empresa";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { Common } from "../../shared/common";
import { AuthService } from "../../services/auth.service";
import { EmpresaService } from "../../services/empresa.service";
import { firstValueFrom, Subject } from "rxjs";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ModalComponent } from "../../components/modal/modal.component";
import { FormsModule } from "@angular/forms";

 @Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrl: './empresa.component.css',
    imports: [SidebarComponent,FormsModule],
 })


export class EmpresaComponent implements OnInit, OnDestroy {  
  public empresa: Empresa = new Empresa();
  public isHandset:boolean = false;
  public title: string = 'Cadastro de Empresa';
  
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;

  public modalRef?: BsModalRef;
  private onDestroy$: Subject<void> = new Subject<void>();
  

  constructor(private authService: AuthService,    
    private empresaService:EmpresaService,
    private common: Common,
    private router: Router,
    private modalService: BsModalService,
  ){
  }
   
  
  async ngOnInit(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.isHandset = true   
      this.empresa =await this.loadEmpresa()
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
		this.onDestroy$.unsubscribe();
  }

  async  loadEmpresa(): Promise<Empresa> {
    return await firstValueFrom(this.empresaService.getEmpresas())
                .then((empresasData) => {
                  if(empresasData && empresasData.length > 0){
                    return empresasData[0]; // Retorna a primeira empresa encontrada
                  } else {
                    this.common.toast('Nenhuma empresa cadastrada.', 'info'); 
                    return new Empresa(); // Retorna uma nova instância de Empresa caso não haja empresas cadastradas
                  }
                }).catch((error) => {        
                  this.common.toast(`Erro ao carregar empresa, motivo: ${error.message}`, 'error');
                  return new Empresa(); // Retorna uma nova instância de Empresa em caso de erro
                });
      
  }

  saveEmpresa(id:number,empresa:Empresa) {
    try {
          
      const body = new Empresa({
        nomeFantasia: empresa.nomeFantasia.trim(),
        razaoSocial: empresa.razaoSocial.trim(),
        cnpj: empresa.cnpj.trim(),
      });

      if (!body.nomeFantasia) {
        this.common.toast('Nome Fantasia é obrigatório.', 'error'); 
        return; 
      }
    

      if (id){ 
          this.empresaService.updateEmpresa(id, body).subscribe({
          next: (response: Empresa) => {       
              this.common.toast('Empresa atualizada!','success');
              this.router.navigate(['/dashboard']); // Redireciona para a página de dashboard após a atualização
          },
          error: (e) => {      
            this.common.toast(e.response?.data || 'Erro ao salvar empresa.', 'error'); 
          }
      
        });
      }else{ 
        this.empresaService.addEmpresa(body).subscribe({
          next: (response: Empresa) => {                              
              this.router.navigate(['/dashboard']); // Redireciona para a página de dashboard após a criação
               this.common.toast('Empresa criada!','success');
          },
          error: (error) => {          
            this.common.toast(error.response?.data || 'Erro ao salvar empresa.', 'error'); 
          }
      
        });
      }

      } catch (e) { 
        this.common.toast('Erro ao salvar empresa.', 'error'); 
      }
  }

  async deleteEmpresa(id:number, nome:string) {

    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
      },
      keyboard: false,
      ignoreBackdropClick: true,
    });

  
    if (!await this.modalRef?.content?.confirmDialog('Excluir empresa?', `"${nome}" será removida permanentemente.`)) 
      return;

    this.empresaService.deleteEmpresa(id).subscribe({
        next: () => {
          this.common.toast('Empresa excluída.','success'); 
          this.modalRef?.onHidden?.subscribe(() => {
            console.log('Modal fechou!');
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {          
          this.common.toast('Erro ao excluir empresa.', 'error'); 
        }
      });  
  }

  cancelar(){    
    this.router.navigate(['/dashboard']);
    this.ngOnDestroy();
  }

}







