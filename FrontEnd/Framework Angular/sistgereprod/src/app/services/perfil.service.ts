import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Empresa } from "../model/empresa";
import { Perfil } from "../model/perfil";

@Injectable({
  providedIn: 'root'
})

export class PerfilService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { 
    }

    getPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(`${this.apiUrl}/Perfil`);
    }

    getPerfilId(id:number): Observable<Perfil> {
        return this.http.get<Perfil>(`${this.apiUrl}/Perfil/${id}`);
    }

    addPerfil(perfil: Perfil): Observable<Perfil> {
        return this.http.post<Perfil>(`${this.apiUrl}/Perfil`, perfil);
    }

    updatePerfil(id:number,perfil:Perfil):Observable<Perfil>{
        return this.http.put<Perfil>(`${this.apiUrl}/Perfil/${id}`,perfil);
    }

    deletePerfil(id:number){
        return this.http.delete(`${this.apiUrl}/Perfil/${id}`);
    }

    getRelatorioPdf(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/Perfil/RelatorioPdf`, { responseType: 'blob' });
    }
}