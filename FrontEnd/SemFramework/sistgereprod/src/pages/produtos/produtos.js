// ══════════════════════════════════════════════
// ── produtos.js ──
// ══════════════════════════════════════════════

let produtosData = [];

if (requireAuth()) {
  initSidebarUser();
  initModalClose();
  document.getElementById('btn-new-produto').onclick = () => openProdutoModal();
  document.getElementById('search-produtos').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderProdutos(produtosData.filter(p =>
      (p.nome || p.Nome || '').toLowerCase().includes(q) ||
      (p.marca || p.Marca || '').toLowerCase().includes(q) ||
      (p.categoria || p.Categoria || '').toLowerCase().includes(q)
    ));
  });
  
  
  loadProdutos()
  .then(produtosData => {         
    if(produtosData.length > 0){
      document.getElementById('report').innerHTML= headerAction?.() || '';  
      bindHeaderAction?.();
    }
  }).catch((error) => {
    toast('Erro ao carregar produtos:', error);
  });

}

async function loadProdutos() {
  document.getElementById('table-produtos').innerHTML = '<div class="loading"><span class="spinner"></span>Carregando...</div>';
  try {
    const { data } = await api.get('/Produto');
    produtosData = data || [];
    renderProdutos(produtosData);
    return produtosData;
  } catch (e) {
    document.getElementById('table-produtos').innerHTML = '<div class="empty"><p>Erro ao carregar produtos.</p></div>';
  }
}

function renderProdutos(list) {
  document.getElementById('table-produtos').innerHTML = list.length
    ? `<table>
        <thead><tr><th>Código</th><th>Nome</th><th>Descrição</th><th>Marca</th><th>Categoria</th><th>Estoque</th><th style="text-align:right">Ações</th></tr></thead>
        <tbody>${list.map(p => `<tr>
          <td><span class="badge badge-blue">${p.codigo || p.Codigo || '—'}</span></td>
          <td><strong>${p.nome || p.Nome || '—'}</strong></td>
          <td class="text-muted">${p.descricao || p.Descricao || '—'}</td>
          <td>${p.marca || p.Marca || '—'}</td>
          <td><span class="badge badge-amber">${p.categoria || p.Categoria || '—'}</span></td>
          <td><span class="badge ${(p.quantidadeEstoque || p.QuantidadeEstoque || 0) > 0 ? 'badge-green' : 'badge-red'}">${p.quantidadeEstoque || p.QuantidadeEstoque || 0}</span></td>
          <td style="text-align:right">
            <div class="flex gap-2" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openProdutoModal(${p.id || p.Id})" title="Editar">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteProduto(${p.id || p.Id},'${(p.nome || p.Nome || '').replace(/'/g, "\\'")}')">
                <svg width="13" height="13" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </td>
        </tr>`).join('')}</tbody>
      </table>`
    : `<div class="empty"><p>Nenhum produto cadastrado.</p></div>`;
}

function openProdutoModal(id) {
  const p = id ? produtosData.find(x => (x.id || x.Id) === id) : null;
  const v = p || {};
  openModal(id ? 'Editar Produto' : 'Novo Produto', `
    <div class="form-grid">
      <div class="form-group"><label>Código</label><input id="f-codigo" type="number" value="${v.codigo || v.Codigo || ''}"></div>
      <div class="form-group"><label>Nome *</label><input id="f-nome" value="${v.nome || v.Nome || ''}"></div>
      <div class="form-group full"><label>Descrição</label><textarea id="f-descricao">${v.descricao || v.Descricao || ''}</textarea></div>
      <div class="form-group"><label>Marca</label><input id="f-marca" value="${v.marca || v.Marca || ''}"></div>
      <div class="form-group"><label>Categoria</label><input id="f-categoria" value="${v.categoria || v.Categoria || ''}"></div>
      <div class="form-group"><label>Quantidade em Estoque</label><input id="f-estoque" type="number" value="${v.quantidadeEstoque || v.QuantidadeEstoque || 0}"></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="saveProduto(${id || 0})">${id ? 'Salvar' : 'Criar Produto'}</button>`
  );
}

async function saveProduto(id) {
  const body = {
    codigo: parseInt(document.getElementById('f-codigo').value) || 0,
    nome: document.getElementById('f-nome').value.trim(),
    descricao: document.getElementById('f-descricao').value.trim(),
    marca: document.getElementById('f-marca').value.trim(),
    categoria: document.getElementById('f-categoria').value.trim(),
    quantidadeEstoque: parseInt(document.getElementById('f-estoque').value) || 0,
  };
  if (!body.nome) { toast('Nome é obrigatório.', 'error'); return; }
  try {
    if (id) await api.put(`/Produto/${id}`, body);
    else await api.post('/Produto', body);
    toast(id ? 'Produto atualizado!' : 'Produto criado!');
    closeModal(); loadProdutos();
  } catch (e) { toast(e.response?.data || 'Erro ao salvar produto.', 'error'); }
}

async function deleteProduto(id, nome) {
  if (!await confirmDialog('Excluir produto?', `"${nome}" será removido permanentemente.`)) return;
  try { await api.delete(`/Produto/${id}`); toast('Produto excluído.'); loadProdutos(); }
  catch (e) { toast('Erro ao excluir produto.', 'error'); }
}

function headerAction() {
  return `<button class="btn btn-primary btn-sm" id="btn-relatorio-produto">Relatório PDF</button>`;
}

function bindHeaderAction() {
  setTimeout(() => {    
    document.getElementById('btn-relatorio-produto')?.addEventListener('click', () => this.gerarRelatorio());
  }, 10);
}

async function gerarRelatorio() {
  try {
    const { data } = await api.get('/Produto/RelatorioPdf',{ responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));      
    window.open(url, '_blank');
  } catch(error) {
    toast('Erro ao gerar relatório.', error);
  }
}

