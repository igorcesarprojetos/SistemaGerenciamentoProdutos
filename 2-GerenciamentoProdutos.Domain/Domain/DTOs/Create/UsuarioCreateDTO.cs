namespace GerenciamentoProdutos.Domain.DTOs.Create
{
    public  class UsuarioCreateDTO
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
