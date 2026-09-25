/**
 * PerfisPage — CRUD completo de perfis de acesso.
 */
class PerfisPage {
  constructor(api) {
    this._api  = api;
    this._data = [];
    this.title = 'Perfis';
  }

  headerAction() {
    return UI.btnNovo('btn-new-perfil', 'Novo Perfil');
  }

  bindHeaderAction() {
    setTimeout(() => {
      document.getElementById('btn-new-perfil')?.addEventListener('click', () => this.openModal());
    }, 10);
  }

  async load() {
    document.getElementById('table-perfis').innerHTML = UI.loading();
    try {
      const { data } = await this._api.get('/Perfil');
      this._data = data || [];
      this._render(this._data);
      this._bindSearch();
    } catch {
      document.getElementById('table-perfis').innerHTML = UI.empty('Erro ao carregar perfis.');
    }
  }

  _render(list) {
    document.getElementById('table-perfis').innerHTML = list.length
      ? `<table>
           <thead><tr><th>ID</th><th>Descrição</th><th style="text-align:right">Ações</th></tr></thead>
           <tbody>${list.map(p => `<tr>
             <td class="text-muted">#${p.id || p.Id}</td>
             <td><strong>${p.descricaoPerfil || p.DescricaoPerfil || '—'}</strong></td>
             <td style="text-align:right">
               <div class="flex gap-2" style="justify-content:flex-end">
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.perfis.openModal(${p.id || p.Id})" title="Editar">${UI.iconEdit()}</button>
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.perfis.delete(${p.id || p.Id},'${(p.descricaoPerfil || p.DescricaoPerfil || '').replace(/'/g, "\\'")}')">${UI.iconDelete()}</button>
               </div>
             </td>
           </tr>`).join('')}</tbody>
         </table>`
      : UI.empty('Nenhum perfil cadastrado.');
  }

  _bindSearch() {
    const el = document.getElementById('search-perfis');
    if (el._bound) return;
    el._bound = true;
    el.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      this._render(this._data.filter(p =>
        (p.descricaoPerfil || p.DescricaoPerfil || '').toLowerCase().includes(q)
      ));
    });
  }

  openModal(id = 0) {
    const p = id ? this._data.find(x => (x.id || x.Id) === id) : null;
    const v = p || {};
    UI.openModal(
      id ? 'Editar Perfil' : 'Novo Perfil',
      `<div class="form-grid one-col">
         <div class="form-group">
           <label>Descrição do Perfil *</label>
           <input id="f-p-desc" value="${v.descricaoPerfil || v.DescricaoPerfil || ''}" placeholder="ex: Administrador, Operador...">
         </div>
       </div>`,
      `<button class="btn btn-ghost" onclick="UI.closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="window.App.pages.perfis.save(${id})">${id ? 'Salvar' : 'Criar Perfil'}</button>`
    );
  }

  async save(id) {
    // const body = { descricaoPerfil: document.getElementById('f-p-desc').value.trim() };
    // if (!body.descricaoPerfil) { UI.toast('Descrição é obrigatória.', 'error'); return; }
    // try {
    //   if (id) await this._api.put(`/Perfil/${id}`, body);
    //   else    await this._api.post('/Perfil', body);
    //   UI.toast(id ? 'Perfil atualizado!' : 'Perfil criado!');
    //   UI.closeModal();
    //   this.loadPerfil();
    // } catch (e) { UI.toast(e.response?.data || 'Erro ao salvar perfil.', 'error'); }
    const perfil = new Perfil();
    perfil.descricaoPerfil = document.getElementById('f-p-desc').value.trim();
    const body = { descricaoPerfil: perfil.descricaoPerfil };
    if (!body.descricaoPerfil) { UI.toast('Descrição é obrigatória.', 'error'); return; }
    try {
      if (id) await this._api.put(`/Perfil/${id}`, body);
      else    await this._api.post('/Perfil', body);
      UI.toast(id ? 'Perfil atualizado!' : 'Perfil criado!');
      UI.closeModal();
      this.load();
    } catch (e) { UI.toast(e.response?.data || 'Erro ao salvar perfil.', 'error'); }
  }

  async delete(id, desc) {
    if (!await UI.confirm('Excluir perfil?', `"${desc}" será removido permanentemente.`)) return;
    try {
      await this._api.delete(`/Perfil/${id}`);
      UI.toast('Perfil excluído.');
      this.load();
    } catch { UI.toast('Erro ao excluir perfil.', 'error'); }
  }
}

class Perfil {
  id;
  descricaoPerfil;
  // constructor(id, descricaoPerfil) {
  //   this.id = id;
  //   this.descricaoPerfil = descricaoPerfil;
  // }
}
