using GerenciamentoProdutos.Domain.Entities.BaseEntities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciamentoProdutos.Domain.Entities
{
    [Table("Categoria")]
    public class Categoria: BaseEntitie
    {

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Descricao { get; set; }

    }
}
