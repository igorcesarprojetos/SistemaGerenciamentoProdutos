using GerenciamentoProdutos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;


namespace GerenciamentoProdutos.Repository.Context
{
    public class RepositoryPatternContext : DbContext
    {
        public RepositoryPatternContext(DbContextOptions<RepositoryPatternContext> options) : base(options)
        {

        }
        
        public DbSet<Usuario> Usuario { get; set; }      
        public DbSet<Perfil> Perfil { get; set; }
        public DbSet<Empresa> Empresa { get; set; }
        public DbSet<Produto> Produto { get; set; }
        public DbSet<Categoria> Categoria { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            base.OnConfiguring(optionsBuilder);
        }
    }
}

