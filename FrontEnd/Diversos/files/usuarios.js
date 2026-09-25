// ══════════════════════════════════════════════
// ── usuarios.js ──
// ══════════════════════════════════════════════

let usuariosData = [];

if (requireAuth()) {
  initSidebarUser();
  initModalClose();
  document.getElementById('btn-new-usuario').onclick = () => openUsuarioModal();
  document.getElementById('search-usuarios').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderUsuarios(usuariosData.filter(u =>
      (u.nome || u.Nome || '').toLowerCase().includes(q) ||
      (u.email || u.Email || '').toLowerCase().includes(q)
    ));
  });
  loadUsuarios();
}

async function loadUsuarios() {
  document.getElementById('table-usuarios').innerHTML = '<div class="loading"><span class="spinner"></span>Carregando...</div>';
  try {
    const [{ data: us }, { data: em }, { data: pe }] = await Promise.all([
      api.get('/Usuario'),
      api.get('/Empresa').catch(() => ({ data: [] })),
      api.get('/Perfil').catch(() => ({ data: [] })),
    ]);
    usuariosData = us || [];
    window._empresasList = em || [];
    window._perfisList = pe || [];
    renderUsuarios(usuariosData);
  } catch (e) {
    document.getElementById('table-usuarios').innerHTML = '<div class="empty"><p>Erro ao carregar usuários.</p></div>';
  }
}

function renderUsuarios(list) {
  document.getElementById('table-usuarios').innerHTML = list.length
    ? `<table>
        <thead><tr><th>ID</th><th>Nome</th><th>Login</th><th>E-mail</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
        <tbody>${list.map(u => `<tr>
          <td class="text-muted">#${u.id || u.Id}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--primary-dark);flex-shrink:0">${(u.nome || u.Nome || '?').substring(0,2).toUpperCase()}</div>
              <strong>${u.nome || u.Nome || '—'}</strong>
            </div>
          </td>
          <td class="text-muted">${u.login || u.Login || '—'}</td>
          <td class="text-muted">${u.email || u.Email || '—'}</td>
          <td><span class="badge ${(u.indAtivo || u.IndAtivo) ? 'badge-green' : 'badge-red'}">${(u.indAtivo || u.IndAtivo) ? 'Ativo' : 'Inativo'}</span></td>
          <td style="text-align:right">
            <div class="flex gap-2" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openUsuarioModal(${u.id || u.Id})" title="Editar">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteUsuario(${u.id || u.Id},'${(u.nome || u.Nome || '').replace(/'/g, "\\'")}')">
                <svg width="13" height="13" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </td>
        </tr>`).join('')}</tbody>
      </table>`
    : `<div class="empty"><p>Nenhum usuário cadastrado.</p></div>`;
}

function openUsuarioModal(id) {
  const u = id ? usuariosData.find(x => (x.id || x.Id) === id) : null;
  const v = u || {};
  const ems = (window._empresasList || []).map(e => `<option value="${e.id || e.Id}" ${((e.id || e.Id) === (v.empresaId || v.EmpresaId)) ? 'selected' : ''}>${e.nomeFantasia || e.NomeFantasia}</option>`).join('');
  const pes = (window._perfisList || []).map(p => `<option value="${p.id || p.Id}" ${((p.id || p.Id) === (v.perfilId || v.PerfilId)) ? 'selected' : ''}>${p.descricaoPerfil || p.DescricaoPerfil}</option>`).join('');
  openModal(id ? 'Editar Usuário' : 'Novo Usuário', `
    <div class="form-grid">
      <div class="form-group full"><label>Nome *</label><input id="f-u-nome" value="${v.nome || v.Nome || ''}"></div>
      <div class="form-group"><label>Login *</label><input id="f-u-login" value="${v.login || v.Login || ''}"></div>
      <div class="form-group"><label>Senha ${id ? '(deixe vazio para não alterar)' : ' *'}</label><input id="f-u-senha" type="password"></div>
      <div class="form-group full"><label>E-mail</label><input id="f-u-email" type="email" value="${v.email || v.Email || ''}"></div>
      <div class="form-group"><label>Empresa</label><select id="f-u-empresa"><option value="">—</option>${ems}</select></div>
      <div class="form-group"><label>Perfil</label><select id="f-u-perfil"><option value="">—</option>${pes}</select></div>
      <div class="form-group"><label>Status</label>
        <select id="f-u-ativo"><option value="true" ${(v.indAtivo || v.IndAtivo) ? 'selected' : ''}>Ativo</option><option value="false" ${!(v.indAtivo || v.IndAtivo) ? 'selected' : ''}>Inativo</option></select>
      </div>
    </div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="saveUsuario(${id || 0})">${id ? 'Salvar' : 'Criar Usuário'}</button>`
  );
}

async function saveUsuario(id) {
  const body = {
    nome: document.getElementById('f-u-nome').value.trim(),
    login: document.getElementById('f-u-login').value.trim(),
    email: document.getElementById('f-u-email').value.trim(),
    empresaId: parseInt(document.getElementById('f-u-empresa').value) || 0,
    perfilId: parseInt(document.getElementById('f-u-perfil').value) || 0,
    indAtivo: document.getElementById('f-u-ativo').value === 'true',
  };
  const senha = document.getElementById('f-u-senha').value;
  if (senha) body.senha = senha;
  if (!body.nome || !body.login) { toast('Nome e Login são obrigatórios.', 'error'); return; }
  if (!id && !senha) { toast('Senha é obrigatória ao criar usuário.', 'error'); return; }
  try {
    if (id) await api.put(`/Usuario/${id}`, body);
    else await api.post('/Usuario', { ...body, senha });
    toast(id ? 'Usuário atualizado!' : 'Usuário criado!');
    closeModal(); loadUsuarios();
  } catch (e) { toast(e.response?.data || 'Erro ao salvar usuário.', 'error'); }
}

async function deleteUsuario(id, nome) {
  if (!await confirmDialog('Excluir usuário?', `"${nome}" será removido permanentemente.`)) return;
  try { await api.delete(`/Usuario/${id}`); toast('Usuário excluído.'); loadUsuarios(); }
  catch (e) { toast('Erro ao excluir usuário.', 'error'); }
}
