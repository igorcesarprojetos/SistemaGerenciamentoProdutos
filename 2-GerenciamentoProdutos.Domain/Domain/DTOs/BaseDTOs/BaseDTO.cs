using GerenciamentoProdutos.Domain.Entities.BaseEntities;

namespace GerenciamentoProdutos.Domain.DTOs.BaseDTOs
{
    public abstract class BaseDTO: BaseEntitie
    {
        public int Id { get; set; }
    }
}
