using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Service
{
    public interface IProdutoService
    {
        void AddProduto(Produto entity);
        void UpdateProduto(Produto entity);
        void DeleteProduto(int id);
        Produto GetProdutoById(int id);
        IEnumerable<Produto> GetAllProduto();
    }
}
