import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) }, 
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'produtos', loadComponent: () => import('./pages/produtos/produtos.component').then(m => m.ProdutosComponent), canActivate: [authGuard] },
  { path: 'empresa', loadComponent: () => import('./pages/empresa/empresa.component').then(m => m.EmpresaComponent), canActivate: [authGuard] }, 
  { path: 'perfis', loadComponent: () => import('./pages/perfis/perfis.component').then(m => m.PerfisComponent), canActivate: [authGuard] },   
  { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent), canActivate: [authGuard] },
  { path: 'usuario', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent), canActivate: [authGuard] },
  { path: 'registrar', loadComponent: () => import('./pages/registrar/registrar.component').then(m => m.RegistrarComponent) },  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
