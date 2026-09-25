using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Repository
{
    public interface IUsuarioRepository: IRepository<Usuario>
    {
        Task<Usuario?> GetLoginPassword(string login, string password);
    }
}
