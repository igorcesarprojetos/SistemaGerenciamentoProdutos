using GerenciamentoProdutos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciamentoProdutos.Repository.Configuration
{
    public class ProdutoConfiguration : IEntityTypeConfiguration<Produto>
    {
        public void Configure(EntityTypeBuilder<Produto> builder)
        {

            builder
                 .ToTable("Produto")
                .HasKey(u => u.Id);

            // Renomear a coluna "Id_Produto" para "Id" no mapeamento
            builder
                 .Property(u => u.Id)
                .HasColumnName("Id_Produto")
            .ValueGeneratedOnAdd();

            builder
                  .HasIndex(u => u.Id)
            .IsUnique();

            builder
             .Property(u => u.Codigo)
             .IsRequired();

            builder
                .HasIndex(u => u.Codigo)
            .IsUnique();

            builder
             .Property(u => u.Nome)
             .HasMaxLength(50)
             .IsRequired();

            builder
                .HasIndex(u => u.Nome)
            .IsUnique();


            builder
              .Property(u => u.Descricao)
              .IsRequired()
              .HasMaxLength(300);

            builder
                 .Property(u => u.Marca)
                .IsRequired()
                .HasMaxLength(100);

            builder
               .HasIndex(u => u.Marca)
           .IsUnique();


            builder
                .Property(u => u.QuantidadeEstoque)
               .IsRequired();


            // Renomear a coluna "Id_Categoria" para "CategoriaId" no mapeamento
            builder
                 .Property(u => u.CategoriaId)
                .HasColumnName("Id_Categoria");

            builder
             .HasOne(u => u.Categoria)
             .WithMany()
             .HasForeignKey(u => u.CategoriaId);
             //.OnDelete(DeleteBehavior.Cascade);

            builder
              .Property(u => u.CategoriaId);
              



            builder
              .Property(u => u.Preco)
              .IsRequired();
              









        }
    }
}
