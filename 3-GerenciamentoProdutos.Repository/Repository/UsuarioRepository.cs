using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Repository.Context;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoProdutos.Repository
{
    public class UsuarioRepository: Repository<Usuario>, IUsuarioRepository
    {

       
        public UsuarioRepository(RepositoryPatternContext context)
            : base(context)
        {
            
        }
        public async Task<Usuario?> GetLoginPassword(string login, string password)
        {
            var usuario = await _dbSet.SingleOrDefaultAsync(x => x.Login == login && x.Senha == password);

            return usuario;

        }
    }  
    
}