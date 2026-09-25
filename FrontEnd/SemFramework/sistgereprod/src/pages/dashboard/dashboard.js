// ══════════════════════════════════════════════
// ── dashboard.js ──
// ══════════════════════════════════════════════

if (requireAuth()) {
  initSidebarUser();
  loadDashboard();
}

async function loadDashboard() {
  try {
    const [pr, em, us, pe] = await Promise.all([
      api.get('/Produto').catch(() => ({ data: [] })),
      api.get('/Empresa').catch(() => ({ data: [] })),
      api.get('/Usuario').catch(() => ({ data: [] })),
      api.get('/Perfil').catch(() => ({ data: [] })),
    ]);
    document.getElementById('stat-produtos').textContent = (pr.data || []).length;
    document.getElementById('stat-empresas').textContent = (em.data || []).length;
    document.getElementById('stat-usuarios').textContent = (us.data || []).length;
    document.getElementById('stat-perfis').textContent = (pe.data || []).length;

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
      : `<div class="empty"><p>Nenhum produto cadastrado.</p></div>`;
  } catch (e) {
    document.getElementById('dashboard-table').innerHTML = '<div class="empty"><p>Erro ao carregar dados.</p></div>';
  }
}
