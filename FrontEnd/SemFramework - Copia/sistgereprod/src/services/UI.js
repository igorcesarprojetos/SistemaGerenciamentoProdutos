/**
 * UI — utilitários globais de interface.
 * Responsável por: Toast, Modal genérico e Dialog de confirmação.
 */
class UI {
  /* ── Toast ─────────────────────────────────── */
  static toast(msg, type = 'success') {
    const icons = {
      success: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      info:    '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/></svg>',
    };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `${icons[type] || ''} ${msg}`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  /* ── Modal genérico ─────────────────────────── */
  static openModal(title, bodyHtml, footerHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML    = bodyHtml;
    document.getElementById('modal-footer').innerHTML  = footerHtml;
    document.getElementById('modal-overlay').classList.add('open');
  }

  static closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
  }

  static initModal() {
    document.getElementById('modal-close').onclick = () => UI.closeModal();
  }

  /* ── Dialog de confirmação ──────────────────── */
  static confirm(title, msg) {
    return new Promise(resolve => {
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-msg').textContent   = msg;
      document.getElementById('confirm-overlay').classList.add('open');

      const close = ok => {
        document.getElementById('confirm-overlay').classList.remove('open');
        resolve(ok);
      };
      document.getElementById('confirm-ok').onclick     = () => close(true);
      document.getElementById('confirm-cancel').onclick = () => close(false);
    });
  }

  /* ── HTML de busca ──────────────────────────── */
  static searchIcon() {
    return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>`;
  }

  /* ── Ícone editar ───────────────────────────── */
  static iconEdit() {
    // return `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    //           <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    //           <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    //         </svg>`;
    return `<i class="fa-solid fa-pen-to-square"></i>`;
  }

  /* ── Ícone excluir ──────────────────────────── */
  static iconDelete() {
    // return `<svg width="13" height="13" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24">
    //           <polyline points="3 6 5 6 21 6"/>
    //           <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    //           <path d="M10 11v6M14 11v6"/>
    //         </svg>`;
    return `<i id="delete" class="fa-solid fa-trash"></i>`;
  }

  /* ── Botão "+ Novo" ─────────────────────────── */
  static btnNovo(id, label) {
    return `<button class="btn btn-primary btn-sm" id="${id}">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg> ${label}
            </button>`;
  }

  /* ── Estado vazio / carregando ──────────────── */
  static loading() {
    return '<div class="loading"><span class="spinner"></span>Carregando...</div>';
  }

  static empty(msg) {
    return `<div class="empty"><p>${msg}</p></div>`;
  }
}
