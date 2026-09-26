using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Helper;
using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Domain.Service
{
    public class UsuarioService : IUsuarioService
    {             
        private readonly IUsuarioRepository _usuarioRepository;       

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;          
        }

        public void AddUsuario(Usuario usuario)
        {
            try
            {
                var password = HelperSHA256.Encrypt(usuario.Senha);
                usuario.Senha = password;
                _usuarioRepository.Add(usuario);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdateUsuario(Usuario usuario)
        {
            try
            {
                if (!string.IsNullOrEmpty(usuario.Login) && !string.IsNullOrEmpty(usuario.Senha))
                {
                    var userfromDB = this.GetLoginPassword(usuario.Login, usuario.Senha);

                    //if (userfromDB.Result != null)
                    //{
                    //    if (userfromDB.Result.Senha != HelperSHA256.Encrypt(usuario.Senha))
                    //    {
                    //        var password = HelperSHA256.Encrypt(usuario.Senha);
                    //        usuario.Senha = password;
                    //    }
                    //}
                    if (userfromDB.Result == null)
                    {
                        var usuarioRepository = _usuarioRepository.GetById(usuario.Id);

                        if (usuario.Senha != usuarioRepository.Senha && HelperSHA256.Encrypt(usuario.Senha) != usuarioRepository.Senha)
                        {
                            var password = HelperSHA256.Encrypt(usuario.Senha);
                            usuario.Senha = password;
                        }
                    }
                }

                _usuarioRepository.Update(usuario);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteUsuario(int id)
        {
            try
            {
                _usuarioRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Usuario GetUsuarioById(int id)
        {
            try
            {
                return _usuarioRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<Usuario> GetAllUsuario()
        {
            try
            {
                return _usuarioRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Usuario?> GetLoginPassword(string login, string password)
        {
            try
            {
                if (await _usuarioRepository.GetLoginPassword(login, password) is Usuario user)
                    return user;

                return await _usuarioRepository.GetLoginPassword(login, HelperSHA256.Encrypt(password));
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            
        }
    }
}
