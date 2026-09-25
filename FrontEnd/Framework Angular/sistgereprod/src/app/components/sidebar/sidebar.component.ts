import { AuthService } from './../../services/auth.service';
import { Component, Input, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit, OnDestroy {

  @Input() isHandset!: boolean;

  public isOpen = false;
  private routerSub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  ngAfterViewInit(): void {
    this.initSidebarUser();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > MOBILE_BREAKPOINT) {
      this.closeMenu();
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.navigateTo('/login');
  }

  initSidebarUser() {

    let token = localStorage.getItem('token') || '';
    let userData = JSON.parse(localStorage.getItem('user') || 'null');

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.onclick = this.authService.logout;

    if (userData) {
      const nameEl = document.getElementById('user-name');
      const perfilEl = document.getElementById('user-perfil');
      const empresaEl = document.getElementById('sidebar-empresa');
      const avatarEl = document.getElementById('user-avatar');
      const n = (userData.nomeUsuario || userData.NomeUsuario || '?');
      if (nameEl) nameEl.textContent = userData.nomeUsuario || userData.NomeUsuario || '—';
      if (perfilEl) perfilEl.textContent = userData.descricaoPerfil || userData.DescricaoPerfil || '—';
      if (empresaEl) empresaEl.textContent = userData.nomeEmpresa || userData.NomeEmpresa || '—';
      if (avatarEl) avatarEl.textContent = n.substring(0, 2).toUpperCase();
    }
  }
}
