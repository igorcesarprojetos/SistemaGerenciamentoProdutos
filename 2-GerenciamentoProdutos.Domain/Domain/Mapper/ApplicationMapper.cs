using AutoMapper;
using GerenciamentoProdutos.Domain.DTOs.Create;
using GerenciamentoProdutos.Domain.DTOs.Update;
using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.DTOs.Create;

namespace GerenciamentoProdutos.Domain.Mapper
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<Usuario, UsuarioCreateDTO>().ReverseMap(); 
            CreateMap<Empresa, EmpresaCreateDTO>().ReverseMap(); 
            CreateMap<Perfil, PerfilCreateDTO>().ReverseMap();        
            CreateMap<Produto, ProdutoCreateDTO>().ReverseMap();        
            CreateMap<Categoria, CategoriaCreateDTO>().ReverseMap();        

            CreateMap<Usuario, UsuarioUpdateDTO>().ReverseMap(); 
            CreateMap<Empresa, EmpresaUpdateDTO>().ReverseMap(); 
            CreateMap<Perfil, PerfilUpdateDTO>().ReverseMap(); 
            CreateMap<Produto, ProdutoUpdateDTO>().ReverseMap(); 
            CreateMap<Categoria, CategoriaUpdateDTO>().ReverseMap(); 
 

        }
    }
}
