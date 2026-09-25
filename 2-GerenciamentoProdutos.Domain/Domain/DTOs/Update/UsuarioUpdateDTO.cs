using GerenciamentoProdutos.Domain.DTOs.BaseDTOs;

namespace GerenciamentoProdutos.Domain.DTOs.Update
{
    public  class UsuarioUpdateDTO: BaseDTO
    {
        public string Nome { get; set; }

        public string Login { get; set; }

        public string Senha { get; set; }

        public string Email { get; set; }
        
        public int EmpresaId { get; set; }
        
        public int PerfilId { get; set; }      

        public bool IndAtivo { get; set; }
    }
}
