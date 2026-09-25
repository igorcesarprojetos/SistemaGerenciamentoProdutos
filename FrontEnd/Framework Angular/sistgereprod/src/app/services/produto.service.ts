import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Produto } from "../model/produto";

@Injectable({
  providedIn: 'root'
})

export class ProdutoService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { 
    }

    getProdutos(): Observable<Produto[]> {
        return this.http.get<Produto[]>(`${this.apiUrl}/Produto`);
    }

    getProdutoId(id:number): Observable<Produto> {
        return this.http.get<Produto>(`${this.apiUrl}/Produto/${id}`);
    }

    addProduto(produto:Produto):Observable<Produto>{
        return this.http.post<Produto>(`${this.apiUrl}/Produto`,produto);
    }

    updateProduto(id:number,produto:Produto):Observable<Produto>{
        return this.http.put<Produto>(`${this.apiUrl}/Produto/${id}`,produto);
    }

    deleteProduto(id:number){
        return this.http.delete(`${this.apiUrl}/Produto/${id}`);
    }

    getRelatorioPdf(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/Produto/RelatorioPdf`, { responseType: 'blob' });
    }
}