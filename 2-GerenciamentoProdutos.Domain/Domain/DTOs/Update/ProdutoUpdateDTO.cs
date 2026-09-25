using System.ComponentModel.DataAnnotations;

namespace GerenciamentoProdutos.Domain.DTOs.Update
{
    public class ProdutoUpdateDTO
    {
        public long Codigo { get; set; }

        public string Nome { get; set; }

        public string Descricao { get; set; }

        public string Marca { get; set; }

        public int QuantidadeEstoque { get; set; }

        public int CategoriaId { get; set; }

        public decimal Preco { get; set; }
    }
}
