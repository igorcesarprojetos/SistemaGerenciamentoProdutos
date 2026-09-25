import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Empresa } from "../model/empresa";

@Injectable({
  providedIn: 'root'
})

export class EmpresaService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { 
    }

    getEmpresas(): Observable<Empresa[]> {
        return this.http.get<Empresa[]>(`${this.apiUrl}/Empresa`);
    }

    getEmpresaId(id:number): Observable<Empresa> {
        return this.http.get<Empresa>(`${this.apiUrl}/Empresa/${id}`);
    }

    addEmpresa(empresa:Empresa):Observable<Empresa>{
        return this.http.post<Empresa>(`${this.apiUrl}/Empresa`,empresa);
    }

    updateEmpresa(id:number,empresa:Empresa):Observable<Empresa>{
        return this.http.put<Empresa>(`${this.apiUrl}/Empresa/${id}`,empresa);
    }

    deleteEmpresa(id:number){
        return this.http.delete(`${this.apiUrl}/Empresa/${id}`);
    }
}