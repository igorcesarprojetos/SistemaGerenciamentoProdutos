/**
 * Auth — gerencia login, logout e persistência de sessão.
 */
class Auth {
  constructor(api) {
    this._api = api;
    this.token    = localStorage.getItem('gp_token') || '';
    this.userData = JSON.parse(localStorage.getItem('gp_user') || 'null');

    if (this.token) this._api.setToken(this.token);
  }

  get isLoggedIn() {
    return !!(this.token && this.userData);
  }

  async login(login, senha) {
    const { data } = await this._api.post('/Authentication/login', { login, senha });
    this.token    = data.token;
    this.userData = data;
    this._api.setToken(this.token);
    localStorage.setItem('gp_token', this.token);
    localStorage.setItem('gp_user', JSON.stringify(data));    
    return data;
  }

  logout() {
    this.token    = '';
    this.userData = null;
    this._api.clearToken();
    localStorage.removeItem('gp_token');
    localStorage.removeItem('gp_user');
    document.getElementById('app').style.display = 'none';
    document.getElementById('screen-login').classList.add('active');
  }

  /** Preenche os elementos da sidebar com dados do usuário logado. */
  populateSidebar() {
    if (!this.userData) return;
    const u = this.userData;
    document.getElementById('user-name').textContent    = u.nomeUsuario   || u.NomeUsuario   || '—';
    document.getElementById('user-perfil').textContent  = u.descricaoPerfil || u.DescricaoPerfil || '—';
    document.getElementById('sidebar-empresa').textContent = u.nomeEmpresa || u.NomeEmpresa   || '—';
    const initials = (u.nomeUsuario || u.NomeUsuario || '?').substring(0, 2).toUpperCase();
    document.getElementById('user-avatar').textContent  = initials;
  }

  /** Inicializa os eventos do formulário de login. */
  initLoginForm() {
    const doLogin = async () => {
      const login = document.getElementById('login-user').value.trim();
      const senha = document.getElementById('login-pass').value.trim();
      const errEl = document.getElementById('login-error');
      errEl.style.display = 'none';

      if (!login || !senha) {
        errEl.textContent   = 'Preencha login e senha.';
        errEl.style.display = 'block';
        return;
      }

      const btn = document.getElementById('btn-login');
      btn.textContent = 'Entrando…';
      btn.disabled    = true;

      try {
        await this.login(login, senha);
        window.App.init();
      } catch {
        errEl.textContent   = 'Login ou senha inválidos.';
        errEl.style.display = 'block';
      } finally {
        btn.textContent = 'Entrar';
        btn.disabled    = false;
      }
    };

    document.getElementById('btn-login').onclick = doLogin;
    document.getElementById('login-pass').addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });

    if(document.getElementById('btn-logout')!=null)
      document.getElementById('btn-logout').onclick = () => this.logout();
        
  }
}
