import { Empresa } from "./empresa"
import { Perfil } from "./perfil"

export class Usuario {
   public id!:number

   public nome!:string
 
   public login!:string

   public senha!:string 
 
   public email!:string   

   public empresaId!:number 

   public empresa?:Empresa
  
   public perfilId!:number 

   public perfil?:Perfil        

   public indAtivo!:boolean

   constructor(data?: Partial<Usuario>) {
      Object.assign(this, data);
   }
    
}