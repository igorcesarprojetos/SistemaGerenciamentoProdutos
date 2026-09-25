using Microsoft.EntityFrameworkCore;
using GerenciamentoProdutos.Repository.Context;
using GerenciamentoProdutos.Domain.Interface.Repository;

namespace GerenciamentoProdutos.Repository
{
    public class Repository<T> : IRepository<T>
        where T : class
    {
        private readonly RepositoryPatternContext _dbContext;
        protected readonly DbSet<T> _dbSet;

        public Repository(RepositoryPatternContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<T>();
        }

        public void Add(T entity)
        {
            try
            {
                _dbSet.Add(entity);
                _dbContext.SaveChanges();
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public void Update(T entity)
        {
            try
            {
                var existingEntity = _dbSet.Find(entity.GetType().GetProperty("Id")?.GetValue(entity));
                _dbSet.Entry(existingEntity).CurrentValues.SetValues(entity);
                _dbSet.Update(existingEntity);
                _dbContext.SaveChanges();
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public void Delete(int id)
        {
            try
            {
                T entity = _dbSet.Find(id);
                _dbSet.Remove(entity);
                _dbContext.SaveChanges();

            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public T GetById(int id)
        {
            try
            {
                return _dbSet.Find(id);
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }

        }

        public IEnumerable<T> GetAll()
        {
            try
            {
                return _dbSet.ToList();
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
    }

}
