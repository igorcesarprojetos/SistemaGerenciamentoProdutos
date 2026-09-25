using System.ComponentModel.DataAnnotations;

namespace GerenciamentoProdutos.Domain.Entities.BaseEntities
{
    public class BaseEntitie
    {
        [Key]
        public int Id { get; set; }
    }
}
