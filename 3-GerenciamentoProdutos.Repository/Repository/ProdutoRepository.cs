using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Repository.Context;

namespace GerenciamentoProdutos.Repository
{
    public class ProdutoRepository: Repository<Produto>, IProdutoRepository
    {

       
        public ProdutoRepository(RepositoryPatternContext context)
            : base(context)
        {
            
        }       
    }  
    
}