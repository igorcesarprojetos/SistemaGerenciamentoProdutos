/**
 * UsuariosPage — CRUD completo de usuários.
 */
class UsuariosPage {
  constructor(api) {
    this._api      = api;
    this._data     = [];
    this._empresas = [];
    this._perfis   = [];
    this.title     = 'Usuários';
  }

  headerAction() {
    return UI.btnNovo('btn-new-usuario', 'Novo Usuário');
  }

  bindHeaderAction() {
    setTimeout(() => {
      document.getElementById('btn-new-usuario')?.addEventListener('click', () => this.openModal());
    }, 10);
  }

  async load() {
    document.getElementById('table-usuarios').innerHTML = UI.loading();
    try {
      const [{ data: us }, { data: em }, { data: pe }] = await Promise.all([
        this._api.get('/Usuario'),
        this._api.get('/Empresa').catch(() => ({ data: [] })),
        this._api.get('/Perfil').catch(()  => ({ data: [] })),
      ]);
      this._data     = us || [];
      this._empresas = em || [];
      this._perfis   = pe || [];
      this._render(this._data);
      this._bindSearch();
    } catch {
      document.getElementById('table-usuarios').innerHTML = UI.empty('Erro ao carregar usuários.');
    }
  }

  _render(list) {
    document.getElementById('table-usuarios').innerHTML = list.length
      ? `<table>
           <thead><tr><th>ID</th><th>Nome</th><th>Login</th><th>E-mail</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
           <tbody>${list.map(u => `<tr>
             <td class="text-muted">#${u.id || u.Id}</td>
             <td>
               <div style="display:flex;align-items:center;gap:8px">
                 <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--primary-dark);flex-shrink:0">
                   ${(u.nome || u.Nome || '?').substring(0, 2).toUpperCase()}
                 </div>
                 <strong>${u.nome || u.Nome || '—'}</strong>
               </div>
             </td>
             <td class="text-muted">${u.login || u.Login || '—'}</td>
             <td class="text-muted">${u.email || u.Email || '—'}</td>
             <td><span class="badge ${(u.indAtivo || u.IndAtivo) ? 'badge-green' : 'badge-red'}">${(u.indAtivo || u.IndAtivo) ? 'Ativo' : 'Inativo'}</span></td>
             <td style="text-align:right">
               <div class="flex gap-2" style="justify-content:flex-end">
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.usuarios.openModal(${u.id || u.Id})" title="Editar">${UI.iconEdit()}</button>
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.usuarios.delete(${u.id || u.Id},'${(u.nome || u.Nome || '').replace(/'/g, "\\'")}')">${UI.iconDelete()}</button>
               </div>
             </td>
           </tr>`).join('')}</tbody>
         </table>`
      : UI.empty('Nenhum usuário cadastrado.');
  }

  _bindSearch() {
    const el = document.getElementById('search-usuarios');
    if (el._bound) return;
    el._bound = true;
    el.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      this._render(this._data.filter(u =>
        (u.nome  || u.Nome  || '').toLowerCase().includes(q) ||
        (u.email || u.Email || '').toLowerCase().includes(q)
      ));
    });
  }

  openModal(id = 0) {
    const u  = id ? this._data.find(x => (x.id || x.Id) === id) : null;
    const v  = u || {};
    const ems = this._empresas.map(e =>
      `<option value="${e.id || e.Id}" ${(e.id || e.Id) === (v.empresaId || v.EmpresaId) ? 'selected' : ''}>${e.nomeFantasia || e.NomeFantasia}</option>`
    ).join('');
    const pes = this._perfis.map(p =>
      `<option value="${p.id || p.Id}" ${(p.id || p.Id) === (v.perfilId || v.PerfilId) ? 'selected' : ''}>${p.descricaoPerfil || p.DescricaoPerfil}</option>`
    ).join('');

    UI.openModal(
      id ? 'Editar Usuário' : 'Novo Usuário',
      `<div class="form-grid">
         <div class="form-group full"><label>Nome *</label><input id="f-u-nome" value="${v.nome || v.Nome || ''}"></div>
         <div class="form-group"><label>Login *</label><input id="f-u-login" value="${v.login || v.Login || ''}"></div>
         <div class="form-group"><label>Senha ${id ? '(deixe vazio para não alterar)' : ' *'}</label><input id="f-u-senha" type="password"></div>
         <div class="form-group full"><label>E-mail</label><input id="f-u-email" type="email" value="${v.email || v.Email || ''}"></div>
         <div class="form-group"><label>Empresa</label><select id="f-u-empresa"><option value="">—</option>${ems}</select></div>
         <div class="form-group"><label>Perfil</label><select id="f-u-perfil"><option value="">—</option>${pes}</select></div>
         <div class="form-group"><label>Status</label>
           <select id="f-u-ativo">
             <option value="true"  ${(v.indAtivo || v.IndAtivo) ? 'selected' : ''}>Ativo</option>
             <option value="false" ${!(v.indAtivo || v.IndAtivo) ? 'selected' : ''}>Inativo</option>
           </select>
         </div>
       </div>`,
      `<button class="btn btn-ghost" onclick="UI.closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="window.App.pages.usuarios.save(${id})">${id ? 'Salvar' : 'Criar Usuário'}</button>`
    );
  }

  async save(id) {
    const body = {
      nome:      document.getElementById('f-u-nome').value.trim(),
      login:     document.getElementById('f-u-login').value.trim(),
      email:     document.getElementById('f-u-email').value.trim(),
      empresaId: parseInt(document.getElementById('f-u-empresa').value) || 0,
      perfilId:  parseInt(document.getElementById('f-u-perfil').value)  || 0,
      indAtivo:  document.getElementById('f-u-ativo').value === 'true',
    };
    const senha = document.getElementById('f-u-senha').value;
    if (senha) body.senha = senha;
    if (!body.nome || !body.login) { UI.toast('Nome e Login são obrigatórios.', 'error'); return; }
    if (!id && !senha)             { UI.toast('Senha é obrigatória ao criar usuário.', 'error'); return; }
    try {
      if (id) await this._api.put(`/Usuario/${id}`, body);
      else    await this._api.post('/Usuario', { ...body, senha });
      UI.toast(id ? 'Usuário atualizado!' : 'Usuário criado!');
      UI.closeModal();
      this.load();
    } catch (e) { UI.toast(e.response?.data || 'Erro ao salvar usuário.', 'error'); }
  }

  async delete(id, nome) {
    if (!await UI.confirm('Excluir usuário?', `"${nome}" será removido permanentemente.`)) return;
    try {
      await this._api.delete(`/Usuario/${id}`);
      UI.toast('Usuário excluído.');
      this.load();
    } catch { UI.toast('Erro ao excluir usuário.', 'error'); }
  }
}
