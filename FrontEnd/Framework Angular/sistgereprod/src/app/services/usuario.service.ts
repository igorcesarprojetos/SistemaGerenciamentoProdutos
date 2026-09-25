import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "../model/usuario";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { 
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/Usuario`);
    }

    getUsuarioId(id:number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/Usuario/${id}`);
    }

    addUsuario(Usuario:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.apiUrl}/Usuario`,Usuario);
    }

    updateUsuario(id:number,Usuario:Usuario):Observable<Usuario>{
        return this.http.put<Usuario>(`${this.apiUrl}/Usuario/${id}`,Usuario);
    }

    deleteUsuario(id:number){
        return this.http.delete(`${this.apiUrl}/Usuario/${id}`);
    }

    getRelatorioPdf(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/Usuario/RelatorioPdf`, { responseType: 'blob' });
    }

}