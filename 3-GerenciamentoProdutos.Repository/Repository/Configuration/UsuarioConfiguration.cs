using GerenciamentoProdutos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SuporteTI.Repository.Configuration
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {

            builder
                 .ToTable("Usuario")
                .HasKey(u => u.Id);

            // Renomear a coluna "id_usuario" para "Id" no mapeamento
            builder
                 .Property(u => u.Id)
                .HasColumnName("Id_Usuario")
            .ValueGeneratedOnAdd();

            builder
                  .HasIndex(u => u.Id)
            .IsUnique();

            builder
             .Property(u => u.Nome)
             .HasMaxLength(50)
             .HasDefaultValue(null);

            builder
                .HasIndex(u => u.Nome)
            .IsUnique();


            builder
              .Property(u => u.Login)
              .IsRequired()
              .HasMaxLength(20);

            builder
                .HasIndex(u => u.Login)
            .IsUnique();

            builder
                 .Property(u => u.Senha)
                .IsRequired()
                .HasMaxLength(100); // Dexei 100 porque na hora que gera o HASH da criptografia SHA256 da 64 ou mais carcteres. Ass. Igor


            builder
              .Property(u => u.Email)
              .IsRequired()
              .HasMaxLength(50);


            // Renomear a coluna "Id_Empresa" para "EmpresaId" no mapeamento
            builder
                 .Property(u => u.EmpresaId)
                .HasColumnName("Id_Empresa");
            

            builder
                 .HasOne(u => u.Empresa)
                 .WithMany()
                 .HasForeignKey(u => u.EmpresaId)
                 .OnDelete(DeleteBehavior.Cascade);


            // Renomear a coluna "Id_Perfil" para "PerfilId" no mapeamento
            builder
                 .Property(u => u.PerfilId)
                .HasColumnName("Id_Perfil");

            builder
             .HasOne(u => u.Perfil)
             .WithMany()
             .HasForeignKey(u => u.PerfilId)
             .OnDelete(DeleteBehavior.Cascade);

            builder
              .Property(u => u.PerfilId)
              .HasDefaultValue(null);            


            builder
                .Property(u => u.IndAtivo)
                .HasDefaultValue(null);
                

          


         
        }
    }
}
