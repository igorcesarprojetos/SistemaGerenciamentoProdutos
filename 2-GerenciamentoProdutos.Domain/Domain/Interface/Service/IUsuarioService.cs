using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Service
{
    public interface IUsuarioService
    {
        void AddUsuario(Usuario entity);
        void UpdateUsuario(Usuario entity);
        void DeleteUsuario(int id);
        Usuario GetUsuarioById(int id);
        IEnumerable<Usuario> GetAllUsuario();

        Task<Usuario?> GetLoginPassword(string login, string password);
    }
}
