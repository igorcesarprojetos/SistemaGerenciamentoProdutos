import { environment } from '../../environments/environment.development';
import { Authentication } from '../model/authenication';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginAuth } from '../model/login-auth';
import { isPlatformBrowser } from '@angular/common';
import { Empresa } from '../model/empresa';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}


  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(loginAuth: LoginAuth): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.apiUrl}/Authentication/login`, loginAuth).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {

    if (!this.isBrowser) return false;

    const user = this.getUser();
    if (!user?.expira) return false;

    const expirou = new Date(user.expira).getTime() <= Date.now();
    if (expirou) {
      this.logout(); // limpa o localStorage automaticamente
      return false;
    }
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  getUser(): Authentication | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/Authentication/obter-empresa-registro`);
  }

  addEmpresa(empresa:Empresa):Observable<Empresa>{
    return this.http.post<Empresa>(`${this.apiUrl}/Authentication/registrar-empresa`,empresa);
  }

  addUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}/Authentication/registrar-usuario`,usuario);
  }
}
