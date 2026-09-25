using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Domain.Service
{
    public class PerfilService : IPerfilService
    {
        private readonly IPerfilRepository _perfilRepository;

        public PerfilService(IPerfilRepository perfilRepository)
        {
            _perfilRepository = perfilRepository;
        }

        public void AddPerfil(Perfil perfil)
        {
            try
            {
                _perfilRepository.Add(perfil);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdatePerfil(Perfil perfil)
        {
            try
            {
                _perfilRepository.Update(perfil);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeletePerfil(int id)
        {
            try
            {
                _perfilRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Perfil GetPerfilById(int id)
        {
            try
            {
                return _perfilRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<Perfil> GetAllPerfil()
        {
            try
            {
                return _perfilRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
