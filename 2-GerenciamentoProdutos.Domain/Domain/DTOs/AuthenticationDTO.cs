namespace GerenciamentoProdutos.Domain.DTO
{
    public class AuthenticationDTO
    {
        public string Token { get; set; }
        //public int IdUsuario { get; set; }
        //public int IdEmpresa { get; set; }
        //public int? IdPerfil { get; set; }

        public string NomeUsuario { get; set; }
        public string NomeEmpresa { get; set; }
        public string? DescricaoPerfil { get; set; }
        public DateTime Expira { get; set; }
    }
}
