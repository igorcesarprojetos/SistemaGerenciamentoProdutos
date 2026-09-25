// ══════════════════════════════════════════════
// ── perfis.js ──
// ══════════════════════════════════════════════

let perfisData = [];

if (requireAuth()) {
  initSidebarUser();
  initModalClose();
  document.getElementById('btn-new-perfil').onclick = () => openPerfilModal();
  document.getElementById('search-perfis').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderPerfis(perfisData.filter(p => (p.descricaoPerfil || p.DescricaoPerfil || '').toLowerCase().includes(q)));
  });
  loadPerfis();
}

async function loadPerfis() {
  document.getElementById('table-perfis').innerHTML = '<div class="loading"><span class="spinner"></span>Carregando...</div>';
  try {
    const { data } = await api.get('/Perfil');
    perfisData = data || [];
    renderPerfis(perfisData);
  } catch (e) {
    document.getElementById('table-perfis').innerHTML = '<div class="empty"><p>Erro ao carregar perfis.</p></div>';
  }
}

function renderPerfis(list) {
  document.getElementById('table-perfis').innerHTML = list.length
    ? `<table>
        <thead><tr><th>ID</th><th>Descrição</th><th style="text-align:right">Ações</th></tr></thead>
        <tbody>${list.map(p => `<tr>
          <td class="text-muted">#${p.id || p.Id}</td>
          <td><strong>${p.descricaoPerfil || p.DescricaoPerfil || '—'}</strong></td>
          <td style="text-align:right">
            <div class="flex gap-2" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openPerfilModal(${p.id || p.Id})" title="Editar">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="deletePerfil(${p.id || p.Id},'${(p.descricaoPerfil || p.DescricaoPerfil || '').replace(/'/g, "\\'")}')">
                <svg width="13" height="13" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </td>
        </tr>`).join('')}</tbody>
      </table>`
    : `<div class="empty"><p>Nenhum perfil cadastrado.</p></div>`;
}

function openPerfilModal(id) {
  const p = id ? perfisData.find(x => (x.id || x.Id) === id) : null;
  const v = p || {};
  openModal(id ? 'Editar Perfil' : 'Novo Perfil', `
    <div class="form-grid one-col">
      <div class="form-group"><label>Descrição do Perfil *</label><input id="f-p-desc" value="${v.descricaoPerfil || v.DescricaoPerfil || ''}" placeholder="ex: Administrador, Operador..."></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="savePerfil(${id || 0})">${id ? 'Salvar' : 'Criar Perfil'}</button>`
  );
}

async function savePerfil(id) {
  const body = { descricaoPerfil: document.getElementById('f-p-desc').value.trim() };
  if (!body.descricaoPerfil) { toast('Descrição é obrigatória.', 'error'); return; }
  try {
    if (id) await api.put(`/Perfil/${id}`, body);
    else await api.post('/Perfil', body);
    toast(id ? 'Perfil atualizado!' : 'Perfil criado!');
    closeModal(); loadPerfis();
  } catch (e) { toast(e.response?.data || 'Erro ao salvar perfil.', 'error'); }
}

async function deletePerfil(id, desc) {
  if (!await confirmDialog('Excluir perfil?', `"${desc}" será removido permanentemente.`)) return;
  try { await api.delete(`/Perfil/${id}`); toast('Perfil excluído.'); loadPerfis(); }
  catch (e) { toast('Erro ao excluir perfil.', 'error'); }
}
