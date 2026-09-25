namespace GerenciamentoProdutos.Domain.Interface.Repository
{
    public interface IRepository<T>
        where T : class 
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(int id);
        T GetById(int id);
        IEnumerable<T> GetAll();
        
    }
}
