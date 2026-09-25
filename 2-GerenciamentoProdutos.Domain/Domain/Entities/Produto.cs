using GerenciamentoProdutos.Domain.Entities.BaseEntities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciamentoProdutos.Domain.Entities
{
    [Table("Produto")]
    public class Produto: BaseEntitie
    {

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]      
        public long Codigo { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(300, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Marca { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]        
        public int QuantidadeEstoque { get; set; }


        [ForeignKey("Id_Categoria")]
        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        public int CategoriaId { get; set; }

        public virtual Categoria Categoria { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]        
        public decimal Preco { get; set; }

    }
}
