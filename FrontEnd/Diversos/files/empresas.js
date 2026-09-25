// ══════════════════════════════════════════════
// ── empresas.js ──
// ══════════════════════════════════════════════

let empresasData = [];

if (requireAuth()) {
  initSidebarUser();
  initModalClose();
  document.getElementById('btn-new-empresa').onclick = () => openEmpresaModal();
  document.getElementById('search-empresas').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderEmpresas(empresasData.filter(x =>
      (x.nomeFantasia || x.NomeFantasia || '').toLowerCase().includes(q) ||
      (x.cnpj || x.CNPJ || '').includes(q)
    ));
  });
  loadEmpresas();
}

async function loadEmpresas() {
  document.getElementById('table-empresas').innerHTML = '<div class="loading"><span class="spinner"></span>Carregando...</div>';
  try {
    const { data } = await api.get('/Empresa');
    empresasData = data || [];
    renderEmpresas(empresasData);
  } catch (e) {
    document.getElementById('table-empresas').innerHTML = '<div class="empty"><p>Erro ao carregar empresas.</p></div>';
  }
}

function renderEmpresas(list) {
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
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openEmpresaModal(${e.id || e.Id})" title="Editar">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteEmpresa(${e.id || e.Id},'${(e.nomeFantasia || e.NomeFantasia || '').replace(/'/g, "\\'")}')">
                <svg width="13" height="13" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </td>
        </tr>`).join('')}</tbody>
      </table>`
    : `<div class="empty"><p>Nenhuma empresa cadastrada.</p></div>`;
}

function openEmpresaModal(id) {
  const em = id ? empresasData.find(x => (x.id || x.Id) === id) : null;
  const v = em || {};
  openModal(id ? 'Editar Empresa' : 'Nova Empresa', `
    <div class="form-grid one-col">
      <div class="form-group"><label>Nome Fantasia *</label><input id="f-nfantasia" value="${v.nomeFantasia || v.NomeFantasia || ''}"></div>
      <div class="form-group"><label>Razão Social</label><input id="f-rsocial" value="${v.razaoSocial || v.RazaoSocial || ''}"></div>
      <div class="form-group"><label>CNPJ</label><input id="f-cnpj" value="${v.cnpj || v.CNPJ || ''}" placeholder="00.000.000/0000-00"></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="saveEmpresa(${id || 0})">${id ? 'Salvar' : 'Criar Empresa'}</button>`
  );
}

async function saveEmpresa(id) {
  const body = {
    nomeFantasia: document.getElementById('f-nfantasia').value.trim(),
    razaoSocial: document.getElementById('f-rsocial').value.trim(),
    cnpj: document.getElementById('f-cnpj').value.trim(),
  };
  if (!body.nomeFantasia) { toast('Nome Fantasia é obrigatório.', 'error'); return; }
  try {
    if (id) await api.put(`/Empresa/${id}`, body);
    else await api.post('/Empresa', body);
    toast(id ? 'Empresa atualizada!' : 'Empresa criada!');
    closeModal(); loadEmpresas();
  } catch (e) { toast(e.response?.data || 'Erro ao salvar empresa.', 'error'); }
}

async function deleteEmpresa(id, nome) {
  if (!await confirmDialog('Excluir empresa?', `"${nome}" será removida permanentemente.`)) return;
  try { await api.delete(`/Empresa/${id}`); toast('Empresa excluída.'); loadEmpresas(); }
  catch (e) { toast('Erro ao excluir empresa.', 'error'); }
}
