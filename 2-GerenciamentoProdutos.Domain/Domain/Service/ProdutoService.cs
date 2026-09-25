using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Domain.Service
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _ProdutoRepository;

        public ProdutoService(IProdutoRepository ProdutoRepository)
        {
            _ProdutoRepository = ProdutoRepository;
        }

        public void AddProduto(Produto Produto)
        {
            try
            {
                _ProdutoRepository.Add(Produto);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdateProduto(Produto Produto)
        {
            try
            {
                _ProdutoRepository.Update(Produto);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteProduto(int id)
        {
            try
            {
                _ProdutoRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Produto GetProdutoById(int id)
        {
            try
            {
                return _ProdutoRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<Produto> GetAllProduto()
        {
            try
            {
                return _ProdutoRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
