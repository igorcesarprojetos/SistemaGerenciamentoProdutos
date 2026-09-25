using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Domain.Service
{
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaRepository _empresaRepository;

        public EmpresaService(IEmpresaRepository empresaRepository)
        {
            _empresaRepository = empresaRepository;
        }

        public void AddEmpresa(Empresa empresa)
        {
            try
            {
                _empresaRepository.Add(empresa);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdateEmpresa(Empresa empresa)
        {
            try
            {
                _empresaRepository.Update(empresa);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteEmpresa(int id)
        {
            try
            {
                _empresaRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Empresa GetEmpresaById(int id)
        {
            try
            {
                return _empresaRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<Empresa> GetAllEmpresa()
        {
            try
            {
                return _empresaRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
