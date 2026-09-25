using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Domain.Service
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ICategoriaRepository _CategoriaRepository;

        public CategoriaService(ICategoriaRepository CategoriaRepository)
        {
            _CategoriaRepository = CategoriaRepository;
        }

        public void AddCategoria(Categoria Categoria)
        {
            try
            {
                _CategoriaRepository.Add(Categoria);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdateCategoria(Categoria Categoria)
        {
            try
            {
                _CategoriaRepository.Update(Categoria);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteCategoria(int id)
        {
            try
            {
                _CategoriaRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Categoria GetCategoriaById(int id)
        {
            try
            {
                return _CategoriaRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<Categoria> GetAllCategoria()
        {
            try
            {
                return _CategoriaRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
