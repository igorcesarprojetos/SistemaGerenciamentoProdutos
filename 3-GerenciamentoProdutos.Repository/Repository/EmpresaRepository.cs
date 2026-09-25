using GerenciamentoProdutos.Repository.Context;
using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;

namespace GerenciamentoProdutos.Repository
{
    public class EmpresaRepository: Repository<Empresa>, IEmpresaRepository
    {

       
        public EmpresaRepository(RepositoryPatternContext context)
            : base(context)
        {
            
        }
      
    }  
    
}