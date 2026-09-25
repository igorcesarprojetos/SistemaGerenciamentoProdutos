export class Empresa{
    public id!: number
    public nomeFantasia!: string
    public razaoSocial!: string
    public cnpj!: string


    constructor(data?: Partial<Empresa>) {
        Object.assign(this, data);
    }    

}