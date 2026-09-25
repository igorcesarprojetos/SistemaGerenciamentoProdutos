import { Empresa } from './../../model/empresa';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Common } from "../../shared/common";
import { AuthService } from "../../services/auth.service";
import { firstValueFrom, Subject } from "rxjs";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Usuario } from "../../model/usuario";
import { LoginAuth } from "../../model/login-auth";
import { NgxMaskDirective } from 'ngx-mask';


 @Component({
    selector: 'app-registrar',
    templateUrl: './registrar.component.html',
    styleUrl: './registrar.component.css',
    imports: [FormsModule,NgxMaskDirective],    
 })


export class RegistrarComponent implements OnInit, OnDestroy {  
  public empresa: Empresa = new Empresa();
  public empresaObj: Empresa = new Empresa();
  public usuario: Usuario = new Usuario();
  public isHandset:boolean = false;
  public title:string='Registrar Usuario'
  public titleEmpresa: string = 'Cadastro de Empresa';
  public titleUsuario: string = 'Cadastro de Usuario';


  private onDestroy$: Subject<void> = new Subject<void>();
  

  constructor(
    private authService: AuthService,    
    private common: Common,
    private router: Router,    
  ){

  }
   
  
  async ngOnInit(): Promise<void>{    
    try {
      const resp = await firstValueFrom(this.authService.getEmpresas())
        
      if(resp[0]){
        this.empresa = resp[0]
      }
    } catch (error) {
      this.common.toast('Erro ao carregar empresa.', 'error')
    }  
   
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
		this.onDestroy$.unsubscribe();
  }

  async saveRegistro(empresa:Empresa, usuario:Usuario) {
    try {

        if(!this.empresa || !this.empresa.id){

          if (!this.empresa.nomeFantasia) {
            this.common.toast('Nome Fantasia é obrigatório.', 'error'); 
            return; 
          } 
          
    
          this.authService.addEmpresa(this.empresa).subscribe({
            next: (respEmpresa: Empresa) => {                                                    

                  this.usuario.empresaId=respEmpresa.id
                  this.usuario.perfilId=1
                  this.usuario.indAtivo=true

                  if (!this.usuario.login) {
                    this.common.toast('Login é obrigatório.', 'error'); 
                    return; 
                  }  

                  this.authService.addUsuario(this.usuario).subscribe({
                    next:(respUser:Usuario)=>{                 

                      if(respUser){
                        const login =new LoginAuth(respUser.login,this.usuario.senha)
                        this.authService.login(login).subscribe({
                          next:(resLogin)=> {
                            if(resLogin && this.authService.isAuthenticated()){
                              this.common.toast('Usuario criado!','success');                  
                              this.router.navigate(['/dashboard']); // Redireciona para a página de dashboard após a criação
                            }
                          },
                          error:(error)=>{
                            this.common.toast(error.response?.data || 'Erro ao logar com usuario.', 'error'); 
                          }
                        })                   
                      }

                    },
                    error:(error) => {
                        this.common.toast(error.response?.data || 'Erro ao salvar usuario.', 'error'); 
                    },
                  })

            },
            error: (error) => {          
              this.common.toast(error.response?.data || 'Erro ao salvar empresa.', 'error'); 
            }
        
          });
          }else{        

            this.usuario.empresaId=this.empresa.id
            this.usuario.perfilId=1
            this.usuario.indAtivo=true

            if (!this.usuario.login) {
              this.common.toast('Login é obrigatório.', 'error'); 
              return; 
            }  

            this.authService.addUsuario(this.usuario).subscribe({
              next:(respUser:Usuario)=>{                 

                if(respUser){
                  const login =new LoginAuth(respUser.login,this.usuario.senha)
                  this.authService.login(login).subscribe({
                    next:(resLogin)=> {
                      if(resLogin && this.authService.isAuthenticated()){
                        this.common.toast('Usuario criado!','success');                  
                        this.router.navigate(['/dashboard']); // Redireciona para a página de dashboard após a criação
                      }
                    },
                    error:(error)=>{
                      this.common.toast(error.response?.data || 'Erro ao logar com usuario.', 'error'); 
                    }
                  })                   
                }

              },
              error:(error) => {
                  this.common.toast(error.response?.data || 'Erro ao salvar usuario.', 'error'); 
              },
            })

          
          }

    } catch (e) { 
      this.common.toast('Erro ao salvar registro.', 'error'); 
    }
  }

  cancelar(){    
    this.router.navigate(['/login']);    
  }

}







