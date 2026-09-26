import { firstValueFrom } from 'rxjs';
import { ProdutoService } from './../../services/produto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Produto } from '../../model/produto';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { UsuarioService } from '../../services/usuario.service';
import { PerfilService } from '../../services/perfil.service';
import { Usuario } from '../../model/usuario';
import { Empresa } from '../../model/empresa';
import { Perfil } from '../../model/perfil';
import { Categoria } from '../../model/categoria';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit  {
  public user: any;
  public isHandset:boolean = false;
  public isLoading: boolean = true; 
  public produtos:Produto[]=[]
  public usuarios:Usuario[]=[]
  public empresas:Empresa[]=[]
  public perfis:Perfil[]=[]
  @ViewChild('sidebarComponent') sidebarComponent!: SidebarComponent;

  public chartType: ChartConfiguration<'bar'>['type'] = 'bar';
  public chartData: ChartData<'bar'> | null = null;
  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
    },
    maintainAspectRatio: false,
  };

constructor(
    private authService: AuthService,
    private router: Router,
    private produtoService:ProdutoService, 
    private usuarioService:UsuarioService, 
    private perfilService:PerfilService, 
  ) {
    if(authService.isAuthenticated()){
      this.user = authService.getUser();      
      this.isHandset = true;
      if(this.user?.descricaoPerfil !== 'Administrador'){        
        window.alert('Para aparecer as opções de menu referente as telas de Produtos, Empresas, Perfis e Categorias, o usuário terá que está no perfil de Administrador.' +
          'Por favor mudar o perfil na tela de cadastro do seu usuário na tela de usuários.'+
        'Em seguida deslogue do sistema e faça o login novamente com o usuário que está no perfil de Administrador para ter acesso as telas de Produtos, Empresas, Perfis e Categorias.');        
      }
    }
  }

  async ngOnInit(): Promise<void>{
    if (this.authService.isAuthenticated()) {      
      await this.loadDashboard();

      if(this.produtos && this.produtos.length > 0){
        this.isLoading=false
        this.buildCategoryChart(this.produtos || []);
      }else{
         this.chartData = { labels: [], datasets: [] };
      }
    }
  }

   navigateTo(path: string) {
    this.router.navigate([path]);   
  }

  async  loadDashboard():Promise<void> {    
    try {
      // const produtos = await firstValueFrom(this.produtoService.getProdutos()).then((p) => (p || []).slice(0, 8));
      // if(produtos && produtos.length > 0){
      //   this.buildCategoryChart(produtos || []);
      //   document.getElementById('stat-produtos')!.textContent = (produtos || []).length.toString();        
      //   document.getElementById('dashboard-table')!.innerHTML = produtos.length
      //   ? `<table>
      //       <thead>
      //         <tr>
      //           <th>Código</th>
      //           <th>Nome</th>
      //           <th>Marca</th>
      //           <th>Categoria</th>
      //           <th>Estoque</th>
      //           <th>Valor</th>
      //         </tr>
      //       </thead>
      //       <tbody>${produtos.map(p => 
      //         `<tr>
      //           <td><span class="badge badge-blue">${p.codigo || '—'}</span></td>
      //           <td><strong>${p.nome|| '—'}</strong></td>
      //           <td>${p.marca || '—'}</td>
      //           <td><span class="badge badge-amber">${p.categoria || '—'}</span></td>
      //           <td><span class="badge ${(p.quantidadeEstoque || 0) > 0 ? 'badge-green' : 'badge-red'}">${p.quantidadeEstoque || 0}</span></td>
      //           <td>${p.preco?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '—'}</td>
      //         </tr>`).join('')}
      //       </tbody>
      //       </table>`
      //   : `<div class="empty"><p>Nenhum produto cadastrado.</p></div>`;        
      // }else{
      //   document.getElementById('stat-produtos')!.textContent = '0';
      //   this.chartData = { labels: [], datasets: [] };
      // }

      // const usuarios = await firstValueFrom(this.usuarioService?.getUsuarios())
      // if(usuarios && usuarios.length > 0){
      //   document.getElementById('stat-usuarios')!.textContent = (usuarios || []).length.toString();
      // }else{
      //   document.getElementById('stat-usuarios')!.textContent = '0';
      // }

      // const perfis = await firstValueFrom(this.perfilService?.getPerfis())      
      // if(perfis && perfis.length > 0){
      //   document.getElementById('stat-perfis')!.textContent = (perfis || []).length.toString();
      // }else{
      //   document.getElementById('stat-perfis')!.textContent = '0';
      // }

      this.produtos = await firstValueFrom(this.produtoService.getProdutos()).then((p) => (p || []).slice(0, 8));
      

      this.usuarios =await firstValueFrom(this.usuarioService?.getUsuarios())
      this.perfis = await firstValueFrom(this.perfilService?.getPerfis())   
      

    } catch (error) {
      
      if (!(this.produtoService?.getProdutos())) {
        document.getElementById('stat-produtos')!.innerHTML = '<div class="empty"><p>Erro ao carregar dados.</p></div>';          
        document.getElementById('dashboard-table')!.innerHTML = '<div class="empty"><p>Erro ao carregar dados.</p></div>';
        this.chartData = { labels: [], datasets: [] };
      }

      if (!(this.usuarioService?.getUsuarios())) { 
        document.getElementById('stat-usuarios')!.innerHTML = '<div class="empty"><p>Erro ao carregar dados.</p></div>';          
      }

      if (!(this.perfilService?.getPerfis())) {
        document.getElementById('stat-perfis')!.innerHTML = '<div class="empty"><p>Erro ao carregar dados.</p></div>';          
      }     
      
    } 
  }

   private buildCategoryChart(produtos: Produto[]): void {
    const counts = new Map<string, number>();
    (produtos || []).forEach(p => {
      const categoria = p.categoria || 'Sem categoria';
      if (categoria == p.categoria) {
         counts.set(categoria.descricao, (counts.get(categoria.descricao) || 0) + 1);
      }
     
    });
    
    if(counts.size === 0){
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    const data = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

    const palette = ['#1D9E75', '#378ADD', '#BA7517', '#E24B4A', '#8B5CF6', '#EC4899', '#0EA5E9', '#F59E0B'];

    this.chartData = {
      labels: data.map(([categoria]) => categoria),
      datasets: [{
        label: 'Produtos',
        data: data.map(([, count]) => count),
        backgroundColor: data.map((_, i) => palette[i % palette.length]),
        borderRadius: 4,
        maxBarThickness: 80,        
      }],
    };
  }
}
