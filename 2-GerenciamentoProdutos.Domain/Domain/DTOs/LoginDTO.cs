using System.ComponentModel.DataAnnotations;

namespace SuporteTI.Domain.DTOs
{
    public class LoginDTO
    {

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(45, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string? Login { get; set; }

        [Required(ErrorMessage = "Este campo {0} é obrigatório")]
        [StringLength(100, ErrorMessage = "O campo precisa ter entre {2} e {1} caracteres.", MinimumLength = 4)]
        public string? Senha { get; set; }


    }
}