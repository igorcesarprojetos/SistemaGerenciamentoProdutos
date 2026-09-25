using GerenciamentoProdutos.Domain.Entities.BaseEntities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciamentoProdutos.Domain.Entities
{
    [Table("Empresa")]
    public class Empresa: BaseEntitie
    {
        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string NomeFantasia { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string RazaoSocial { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(14, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 14)]
        public string CNPJ { get; set; }


    }
}
