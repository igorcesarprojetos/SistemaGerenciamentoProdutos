using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Repository.Context;

namespace GerenciamentoProdutos.Repository
{
    public class CategoriaRepository: Repository<Categoria>, ICategoriaRepository
    {

       
        public CategoriaRepository(RepositoryPatternContext context)
            : base(context)
        {
            
        }       
    }  
    
}