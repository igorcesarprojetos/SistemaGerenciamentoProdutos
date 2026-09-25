import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Categoria } from "../model/categoria";

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { 
    }

    getCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.apiUrl}/Categoria`);
    }

    getCategoriaId(id:number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/Categoria/${id}`);
    }

    addCategoria(categoria:Categoria):Observable<Categoria>{
        return this.http.post<Categoria>(`${this.apiUrl}/Categoria`,categoria);
    }

    updateCategoria(id:number,categoria:Categoria):Observable<Categoria>{
        return this.http.put<Categoria>(`${this.apiUrl}/Categoria/${id}`,categoria);
    }

    deleteCategoria(id:number){
        return this.http.delete(`${this.apiUrl}/Categoria/${id}`);
    }

    getRelatorioPdf(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/Categoria/RelatorioPdf`, { responseType: 'blob' });
    }
}