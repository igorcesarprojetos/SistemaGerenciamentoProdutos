import { Categoria } from "./categoria";

export class Produto{
    id!: number;
    nome!: string;
    codigo!:number;
    marca!:string;
    //categoria!:string
    descricao!: string;
    preco!: number;
    quantidadeEstoque!: number;
    public categoriaId!:number     
    public categoria?: Categoria

    constructor(data?: Partial<Produto>) {
        Object.assign(this, data);
    }

}