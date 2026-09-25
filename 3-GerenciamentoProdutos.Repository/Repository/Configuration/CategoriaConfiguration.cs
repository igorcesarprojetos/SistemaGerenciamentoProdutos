using GerenciamentoProdutos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciamentoProdutos.Repository.Configuration
{
    public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
    {
        public void Configure(EntityTypeBuilder<Categoria> builder)
        {

            builder
                 .ToTable("Categoria")
                .HasKey(c => c.Id);

            // Renomear a coluna "Id_Categoria" para "Id" no mapeamento
            builder
                 .Property(c => c.Id)
                .HasColumnName("Id_Categoria")
            .ValueGeneratedOnAdd();

            builder
                  .HasIndex(c => c.Id)
            .IsUnique();

            builder
              .Property(c => c.Descricao)
              .IsRequired()
              .HasMaxLength(50);

            builder
               .HasIndex(c => c.Descricao)
           .IsUnique();








        }
    }
}
