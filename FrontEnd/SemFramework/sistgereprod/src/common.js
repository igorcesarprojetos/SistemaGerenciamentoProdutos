// ══════════════════════════════════════════════
// ── common.js ──
// Lógica compartilhada por todas as páginas:
// API/Axios, autenticação, toast, modal, confirmação e sidebar.
// ══════════════════════════════════════════════

const BASE_URL = 'https://localhost:7204/';

let token = localStorage.getItem('gp_token') || '';
let userData = JSON.parse(localStorage.getItem('gp_user') || 'null');

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use(cfg => {
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { logout(); }
  return Promise.reject(err);
});

// ── Proteção de página ──
// Chame no topo de cada página protegida (todas exceto login.html).
// Se não houver sessão, redireciona para login.html.
function requireAuth() {
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ── Logout ──
function logout() {
  token = '';
  userData = null;
  localStorage.removeItem('gp_token');
  localStorage.removeItem('gp_user');
  window.location.href = 'login.html';
}

// ── Sidebar / usuário logado ──
// Preenche nome, perfil, empresa e avatar do usuário, e liga o botão de logout.
function initSidebarUser() {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.onclick = logout;

  if (userData) {
    const nameEl = document.getElementById('user-name');
    const perfilEl = document.getElementById('user-perfil');
    const empresaEl = document.getElementById('sidebar-empresa');
    const avatarEl = document.getElementById('user-avatar');
    const n = (userData.nomeUsuario || userData.NomeUsuario || '?');
    if (nameEl) nameEl.textContent = userData.nomeUsuario || userData.NomeUsuario || '—';
    if (perfilEl) perfilEl.textContent = userData.descricaoPerfil || userData.DescricaoPerfil || '—';
    if (empresaEl) empresaEl.textContent = userData.nomeEmpresa || userData.NomeEmpresa || '—';
    if (avatarEl) avatarEl.textContent = n.substring(0,2).toUpperCase();
  }
}

// ── Toast ──
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = {
    success: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/></svg>'
  };
  el.innerHTML = `${icons[type]||''} ${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ── Confirmação (substitui window.confirm) ──
function confirmDialog(title, msg) {
  return new Promise(resolve => {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent = msg;
    document.getElementById('confirm-overlay').classList.add('open');
    document.getElementById('confirm-ok').onclick = () => { document.getElementById('confirm-overlay').classList.remove('open'); resolve(true); };
    document.getElementById('confirm-cancel').onclick = () => { document.getElementById('confirm-overlay').classList.remove('open'); resolve(false); };
  });
}

// ── Modal genérico (criar/editar) ──
function openModal(title, bodyHtml, footerHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').innerHTML = footerHtml;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}
function initModalClose() {
  const btn = document.getElementById('modal-close');
  if (btn) btn.onclick = closeModal;
}
