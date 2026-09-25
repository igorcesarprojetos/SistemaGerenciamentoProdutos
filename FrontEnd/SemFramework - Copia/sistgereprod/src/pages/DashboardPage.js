/**
 * DashboardPage — exibe estatísticas gerais e lista de produtos recentes.
 */
class DashboardPage {
  constructor(api) {
    this._api = api;
    this.title = 'Dashboard';
  }

  async load() {
    try {
      const [pr, em, us, pe] = await Promise.all([
        this._api.get('/Produto').catch(() => ({ data: [] })),
        this._api.get('/Empresa').catch(() => ({ data: [] })),
        this._api.get('/Usuario').catch(() => ({ data: [] })),
        this._api.get('/Perfil').catch(()  => ({ data: [] })),
      ]);

      document.getElementById('stat-produtos').textContent  = (pr.data || []).length;
      document.getElementById('stat-empresas').textContent  = (em.data || []).length;
      document.getElementById('stat-usuarios').textContent  = (us.data || []).length;
      document.getElementById('stat-perfis').textContent    = (pe.data || []).length;

      const produtos = (pr.data || []).slice(0, 8);
      document.getElementById('dashboard-table').innerHTML = produtos.length
        ? `<table>
             <thead><tr><th>Código</th><th>Nome</th><th>Marca</th><th>Categoria</th><th>Estoque</th></tr></thead>
             <tbody>${produtos.map(p => `<tr>
               <td><span class="badge badge-blue">${p.codigo || p.Codigo || '—'}</span></td>
               <td><strong>${p.nome || p.Nome || '—'}</strong></td>
               <td>${p.marca || p.Marca || '—'}</td>
               <td><span class="badge badge-amber">${p.categoria || p.Categoria || '—'}</span></td>
               <td><span class="badge ${(p.quantidadeEstoque || p.QuantidadeEstoque || 0) > 0 ? 'badge-green' : 'badge-red'}">${p.quantidadeEstoque || p.QuantidadeEstoque || 0}</span></td>
             </tr>`).join('')}</tbody>
           </table>`
        : UI.empty('Nenhum produto cadastrado.');
    } catch {
      document.getElementById('dashboard-table').innerHTML = UI.empty('Erro ao carregar dados.');
    }
  }
}
