export class Perfil{
    public id!: number
    public descricaoPerfil!:string  
    
//     constructor(data?: Partial<Perfil>) {
//       Object.assign(this, data);
//    }

   constructor(id?: number, descricaoPerfil?: string) {
    this.id = id ?? 0;
    this.descricaoPerfil = descricaoPerfil ?? '';
   }
}