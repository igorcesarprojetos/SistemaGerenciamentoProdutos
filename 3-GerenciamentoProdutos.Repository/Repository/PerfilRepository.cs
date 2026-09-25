using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Repository.Context;

namespace GerenciamentoProdutos.Repository
{
    public class PerfilRepository: Repository<Perfil>, IPerfilRepository
    {
               
        public PerfilRepository(RepositoryPatternContext context)
            : base(context)
        {
            
        }
       
    }  
    
}