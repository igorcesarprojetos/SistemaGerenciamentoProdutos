export class Categoria{
    id!: number;    
    descricao!: string;   

    constructor(data?: Partial<Categoria>) {
        Object.assign(this, data);
    }

}