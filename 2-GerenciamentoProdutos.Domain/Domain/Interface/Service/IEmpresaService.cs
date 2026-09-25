using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.Domain.Interface.Service
{
    public interface IEmpresaService
    {
        void AddEmpresa(Empresa entity);
        void UpdateEmpresa(Empresa entity);
        void DeleteEmpresa(int id);
        Empresa GetEmpresaById(int id);
        IEnumerable<Empresa> GetAllEmpresa();
    }
}
