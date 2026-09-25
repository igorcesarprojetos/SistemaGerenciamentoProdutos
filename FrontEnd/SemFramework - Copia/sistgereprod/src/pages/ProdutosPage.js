/**
 * ProdutosPage — CRUD completo de produtos.
 */
class ProdutosPage {
  constructor(api) {
    this._api  = api;
    this._data = [];
    this.title = 'Produtos';
  }

  headerAction() {
    return `${UI.btnNovo('btn-new-produto', 'Novo Produto')}
            <button class="btn btn-ghost" id="btn-relatorio-produto">Relatório PDF</button>`;
  }

  bindHeaderAction() {
    setTimeout(() => {
      document.getElementById('btn-new-produto')?.addEventListener('click', () => this.openModal());
      document.getElementById('btn-relatorio-produto')?.addEventListener('click', () => this.gerarRelatorio());
    }, 10);
  }

  async gerarRelatorio() {
    try {
      const { data } = await this._api.getBlob('/Produto/RelatorioPdf');
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));      
      window.open(url, '_blank');
    } catch {
      UI.toast('Erro ao gerar relatório.', 'error');
    }
  }

  async load() {
    document.getElementById('table-produtos').innerHTML = UI.loading();
    try {
      const { data } = await this._api.get('/Produto');
      this._data = data || [];
      this._render(this._data);
      this._bindSearch();
    } catch {
      document.getElementById('table-produtos').innerHTML = UI.empty('Erro ao carregar produtos.');
    }
  }

  _render(list) {
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
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.produtos.openModal(${p.id || p.Id})" title="Editar">${UI.iconEdit()}</button>
                 <button class="btn btn-ghost btn-sm btn-icon" onclick="window.App.pages.produtos.delete(${p.id || p.Id},'${(p.nome || p.Nome || '').replace(/'/g, "\\'")}')">${UI.iconDelete()}</button>
               </div>
             </td>
           </tr>`).join('')}</tbody>
         </table>`
      : UI.empty('Nenhum produto cadastrado.');
  }

  _bindSearch() {
    const el = document.getElementById('search-produtos');
    if (el._bound) return;
    el._bound = true;
    el.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      this._render(this._data.filter(p =>
        (p.nome || p.Nome || '').toLowerCase().includes(q) ||
        (p.marca || p.Marca || '').toLowerCase().includes(q) ||
        (p.categoria || p.Categoria || '').toLowerCase().includes(q)
      ));
    });
  }

  openModal(id = 0) {
    const p = id ? this._data.find(x => (x.id || x.Id) === id) : null;
    const v = p || {};
    UI.openModal(
      id ? 'Editar Produto' : 'Novo Produto',
      `<div class="form-grid">
         <div class="form-group"><label>Código</label><input id="f-codigo" type="number" value="${v.codigo || v.Codigo || ''}"></div>
         <div class="form-group"><label>Nome *</label><input id="f-nome" value="${v.nome || v.Nome || ''}"></div>
         <div class="form-group full"><label>Descrição</label><textarea id="f-descricao">${v.descricao || v.Descricao || ''}</textarea></div>
         <div class="form-group"><label>Marca</label><input id="f-marca" value="${v.marca || v.Marca || ''}"></div>
         <div class="form-group"><label>Categoria</label><input id="f-categoria" value="${v.categoria || v.Categoria || ''}"></div>
         <div class="form-group"><label>Quantidade em Estoque</label><input id="f-estoque" type="number" value="${v.quantidadeEstoque || v.QuantidadeEstoque || 0}"></div>
       </div>`,
      `<button class="btn btn-ghost" onclick="UI.closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="window.App.pages.produtos.save(${id})">${id ? 'Salvar' : 'Criar Produto'}</button>`
    );
  }

  async save(id) {
    const body = {
      codigo: parseInt(document.getElementById('f-codigo').value) || 0,
      nome: document.getElementById('f-nome').value.trim(),
      descricao: document.getElementById('f-descricao').value.trim(),
      marca: document.getElementById('f-marca').value.trim(),
      categoria: document.getElementById('f-categoria').value.trim(),
      quantidadeEstoque: parseInt(document.getElementById('f-estoque').value) || 0,
    };
    if (!body.nome) { UI.toast('Nome é obrigatório.', 'error'); return; }
    try {
      if (id) await this._api.put(`/Produto/${id}`, body);
      else    await this._api.post('/Produto', body);
      UI.toast(id ? 'Produto atualizado!' : 'Produto criado!');
      UI.closeModal();
      this.load();
    } catch (e) { UI.toast(e.response?.data || 'Erro ao salvar produto.', 'error'); }
  }

  async delete(id, nome) {
    if (!await UI.confirm('Excluir produto?', `"${nome}" será removido permanentemente.`)) return;
    try {
      await this._api.delete(`/Produto/${id}`);
      UI.toast('Produto excluído.');
      this.load();
    } catch { UI.toast('Erro ao excluir produto.', 'error'); }
  }
}
