using GerenciamentoProdutos.Domain.DTOs.BaseDTOs;

namespace GerenciamentoProdutos.Domain.DTOs.Update
{
    public class EmpresaUpdateDTO: BaseDTO
    {
        public string NomeFantasia { get; set; }

        public string RazaoSocial { get; set; }
        public string CNPJ { get; set; }
    }
}
