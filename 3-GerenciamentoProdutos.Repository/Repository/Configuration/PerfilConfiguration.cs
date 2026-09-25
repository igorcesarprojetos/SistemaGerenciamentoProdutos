using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GerenciamentoProdutos.Domain.Entities;
using System.Reflection.Emit;

namespace GerenciamentoProdutos.Repository.Configuration
{
    public class PerfilConfiguration : IEntityTypeConfiguration<Perfil>
    {
        public void Configure(EntityTypeBuilder<Perfil> builder)
        {
            
            builder
                .ToTable("Perfil")
                .HasKey(pfl => pfl.Id);

            // Renomear a coluna "id_perfil" para "Id" no mapeamento
            builder
                .Property(pfl => pfl.Id)
                .HasColumnName("Id_Perfil")
            .ValueGeneratedOnAdd();

            builder
                 .HasIndex(pfl => pfl.Id)
            .IsUnique();


            builder
               .Property(pfl => pfl.DescricaoPerfil)
               .HasMaxLength(30)
            .IsRequired();

            builder
              .HasIndex(pfl => pfl.DescricaoPerfil)
              .IsUnique();
        }
    }
}
