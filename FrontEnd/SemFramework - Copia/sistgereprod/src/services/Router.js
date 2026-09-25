/**
 * Router — controla a navegação entre as telas (screens).
 * Cada página se registra via Router.register(name, page).
 */
class Router {
  constructor() {
    this._pages  = {};   // { name: PageInstance }
    this._current = null;
  }

  /** Registra uma página no roteador. */
  register(name, page) {
    this._pages[name] = page;
  }

  /** Navega para a tela indicada. */
  navigate(name) {
    // desativa telas e links
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

    // ativa tela e link correspondentes
    document.getElementById('screen-' + name)?.classList.add('active');
    document.querySelector(`nav a[data-screen="${name}"]`)?.classList.add('active');

    // atualiza cabeçalho
    const page = this._pages[name];
    if (page) {     
      document.getElementById('header-title').textContent    = page.title || name;
      document.getElementById('header-actions').innerHTML    = page.headerAction?.() || '';
      page.bindHeaderAction?.();
      page.load?.();
    }

    this._current = name;
  }

  /** Vincula os cliques do menu de navegação. */
  initNav() {
    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => this.navigate(a.dataset.screen));
    });
  }
}
