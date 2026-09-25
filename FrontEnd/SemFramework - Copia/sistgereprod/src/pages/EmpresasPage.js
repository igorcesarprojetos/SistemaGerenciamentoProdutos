/**
 * EmpresasPage — CRUD completo de empresas.
 */
class EmpresasPage {
  constructor(api) {
    this._api  = api;
    this._data = [];
    this.title = 'Empresas';
  }

  headerAction() {
    return UI.btnNovo('btn-new-empresa', 'Nova Empresa');
  }

  bindHeaderAction() {
    setTimeout(() => {
      document.getElementById('btn-new-empresa')?.addEventListener('click', () => this.openModal());
    }, 10);
  }

  async load() {
    document.getElementById('table-empresas').innerHTML = UI.loading();
    try {
      const { data } = await this._api.get('/Empresa');
      this._data = data || [];
      this._render(this._data);
      this._bindSearch();
    } catch {
      document.getElementById('table-empresas').innerHTML = UI.empty('Erro ao carregar empresas.');
    }
  }

  _render(list) {
    document.getElementById('table-empresas').innerHTML = list.length
      ? `<table>
           <thead><tr><th>ID</th><th>Nome Fantasia</th><th>Razão Social</th><th>CNPJ</th><th style="text-align:right">Ações</th></tr></thead>
           <tbody>${list.map(e => `<tr>
             <td class="text-muted">#${e.id || e.Id}</td>
             <td><strong>${e.nomeFantasia || e.NomeFantasia || '—'}</strong></td>
             <td>${e.razaoSocial || e.RazaoSocial || '—'}</td>
             <td class="text-muted">${e.cnpj || e.CNPJ || '—'}</td>
             <td style="text-align:right">
               <div class="flex gap-2" style="justify-content:flex-end">
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.empresas.openModal(${e.id || e.Id})" title="Editar">${UI.iconEdit()}</button>
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.empresas.delete(${e.id || e.Id},'${(e.nomeFantasia || e.NomeFantasia || '').replace(/'/g, "\\'")}')">${UI.iconDelete()}</button>
               </div>
             </td>
           </tr>`).join('')}</tbody>
         </table>`
      : UI.empty('Nenhuma empresa cadastrada.');
  }

  _bindSearch() {
    const el = document.getElementById('search-empresas');
    if (el._bound) return;
    el._bound = true;
    el.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      this._render(this._data.filter(x =>
        (x.nomeFantasia || x.NomeFantasia || '').toLowerCase().includes(q) ||
        (x.cnpj || x.CNPJ || '').includes(q)
      ));
    });
  }

  openModal(id = 0) {
    const em = id ? this._data.find(x => (x.id || x.Id) === id) : null;
    const v  = em || {};
    UI.openModal(
      id ? 'Editar Empresa' : 'Nova Empresa',
      `<div class="form-grid one-col">
         <div class="form-group"><label>Nome Fantasia *</label><input id="f-nfantasia" value="${v.nomeFantasia || v.NomeFantasia || ''}"></div>
         <div class="form-group"><label>Razão Social</label><input id="f-rsocial" value="${v.razaoSocial || v.RazaoSocial || ''}"></div>
         <div class="form-group"><label>CNPJ</label><input id="f-cnpj" value="${v.cnpj || v.CNPJ || ''}" placeholder="00.000.000/0000-00"></div>
       </div>`,
      `<button class="btn btn-ghost" onclick="UI.closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="window.App.pages.empresas.save(${id})">${id ? 'Salvar' : 'Criar Empresa'}</button>`
    );
  }

  async save(id) {
    const body = {
      nomeFantasia: document.getElementById('f-nfantasia').value.trim(),
      razaoSocial:  document.getElementById('f-rsocial').value.trim(),
      cnpj:         document.getElementById('f-cnpj').value.trim(),
    };
    if (!body.nomeFantasia) { UI.toast('Nome Fantasia é obrigatório.', 'error'); return; }
    try {
      if (id) await this._api.put(`/Empresa/${id}`, body);
      else    await this._api.post('/Empresa', body);
      UI.toast(id ? 'Empresa atualizada!' : 'Empresa criada!');
      UI.closeModal();
      this.load();
    } catch (e) { UI.toast(e.response?.data || 'Erro ao salvar empresa.', 'error'); }
  }

  async delete(id, nome) {
    if (!await UI.confirm('Excluir empresa?', `"${nome}" será removida permanentemente.`)) return;
    try {
      await this._api.delete(`/Empresa/${id}`);
      UI.toast('Empresa excluída.');
      this.load();
    } catch { UI.toast('Erro ao excluir empresa.', 'error'); }
  }
}
