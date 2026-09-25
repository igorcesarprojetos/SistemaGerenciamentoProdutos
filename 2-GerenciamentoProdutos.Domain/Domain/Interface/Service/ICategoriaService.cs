using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Service
{
    public interface ICategoriaService
    {
        void AddCategoria(Categoria entity);
        void UpdateCategoria(Categoria entity);
        void DeleteCategoria(int id);
        Categoria GetCategoriaById(int id);
        IEnumerable<Categoria> GetAllCategoria();
    }
}
