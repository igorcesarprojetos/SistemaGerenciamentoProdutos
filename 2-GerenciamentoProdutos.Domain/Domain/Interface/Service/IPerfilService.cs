using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Service
{
    public interface IPerfilService
    {
        void AddPerfil(Perfil entity);
        void UpdatePerfil(Perfil entity);
        void DeletePerfil(int id);
        Perfil GetPerfilById(int id);
        IEnumerable<Perfil> GetAllPerfil();
    }
}
