using GerenciamentoProdutos.Domain.Entities.BaseEntities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciamentoProdutos.Domain.Entities
{
    [Table("Usuario")]
    public class Usuario: BaseEntitie
    {

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(20, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Login { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(08, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Senha { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string Email { get; set; }

        [ForeignKey("Id_Empresa")]
        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        public int EmpresaId { get; set; }

        public virtual Empresa Empresa { get; set; }

        [ForeignKey("Id_Perfil")]
        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        public int PerfilId { get; set; }

        public virtual Perfil Perfil { get; set; }             

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        public bool IndAtivo { get; set; }


    }
}