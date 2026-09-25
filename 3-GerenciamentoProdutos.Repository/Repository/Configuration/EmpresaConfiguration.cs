using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GerenciamentoProdutos.Domain.Entities;
using System.Reflection.Emit;

namespace GerenciamentoProdutos.Repository.Configuration
{
    public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
    {
        public void Configure(EntityTypeBuilder<Empresa> builder)
        {

            builder
                 .ToTable("Empresa")
                .HasKey(emp => emp.Id);

            // Renomear a coluna "id_usuario" para "Id" no mapeamento
            builder
                 .Property(emp => emp.Id)
                .HasColumnName("Id_Empresa")
            .ValueGeneratedOnAdd();

            builder
                  .HasIndex(emp => emp.Id)
            .IsUnique();

            builder
             .Property(emp => emp.NomeFantasia)
             .IsRequired()
             .HasMaxLength(50);

            builder
            .HasIndex(emp => emp.NomeFantasia)
            .IsUnique();

            builder
              .Property(emp => emp.RazaoSocial)
              .IsRequired()
              .HasMaxLength(50);

            builder
            .HasIndex(emp => emp.RazaoSocial)
            .IsUnique();


            builder
              .Property(emp => emp.CNPJ)
              .IsRequired()
              .HasMaxLength(14);

            builder
            .HasIndex(emp => emp.CNPJ)
            .IsUnique();      

        }
    }
}
