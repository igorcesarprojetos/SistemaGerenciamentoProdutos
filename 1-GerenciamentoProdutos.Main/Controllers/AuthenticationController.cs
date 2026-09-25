using AutoMapper;
using GerenciamentoProdutos.Domain.DTO;
using GerenciamentoProdutos.Domain.DTOs.Create;
using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SuporteTI.Domain.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;


namespace GerenciamentoProdutos.Main.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUsuarioService _appUsuario;
        private readonly IEmpresaService _appEmpresa;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private AuthenticationDTO authenticationDTO;
        public AuthenticationController(IUsuarioService appUsuario, IEmpresaService appEmpresa, IConfiguration configuration, IMapper mapper)
        {
            _appUsuario = appUsuario;
            _appEmpresa = appEmpresa;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            if (!string.IsNullOrWhiteSpace(request.Login) && !string.IsNullOrWhiteSpace(request.Senha))
            {
                var usuario = await _appUsuario.GetLoginPassword(request.Login, request.Senha);
                if (!User.Identity.IsAuthenticated)
                {
                    if (usuario != null)
                    {
                        var issuer = _configuration["Jwt:Issuer"];
                        var audience = _configuration["Jwt:Audience"];

                        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                        if (usuario.Empresa != null && usuario.Perfil != null)
                        {
                            var claims = new List<Claim>
                            {
                              //new Claim("usuarioId", usuario.Id.ToString()),
                              //new Claim("empresaId", usuario.Empresa.Id.ToString()),
                              //new Claim(ClaimTypes.Role, usuario.Perfil.Id.ToString())
                              new Claim("usuario", usuario.Nome),
                              new Claim("empresa", usuario.Empresa.NomeFantasia),
                              new Claim(ClaimTypes.Role, usuario.Perfil.DescricaoPerfil)

                            };

                            var token = new JwtSecurityToken(
                                issuer: issuer,
                                audience: audience,
                                expires: DateTime.Now.AddMinutes(120),
                                signingCredentials: credentials,
                                claims: claims
                                );

                            var tokenHandler = new JwtSecurityTokenHandler();

                            var stringToken = tokenHandler.WriteToken(token);

                            authenticationDTO = new()
                            {
                                //IdEmpresa = usuario.Empresa.Id,
                                //IdUsuario = usuario.Id,
                                //IdPerfil = usuario.Perfil.Id,
                                NomeEmpresa = usuario.Empresa.NomeFantasia,
                                NomeUsuario = usuario.Nome,
                                DescricaoPerfil = usuario.Perfil.DescricaoPerfil,
                                Token = stringToken,
                                Expira = DateTime.Now.AddMinutes(120),
                            };


                        }

                        return Ok(authenticationDTO);
                    }

                }

                return BadRequest(request);
            }
            else
            {
                return BadRequest(request);
            }
        }

        [HttpPost("registrar-usuario")]
        public IActionResult RegistrarUsuario([FromBody] UsuarioCreateDTO usuarioCreateDTO)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioCreateDTO);
                _appUsuario.AddUsuario(usuario);
                return StatusCode(StatusCodes.Status201Created, usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost("registrar-empresa")]
        public IActionResult RegistrarEmpresa([FromBody] EmpresaCreateDTO empresaCreateDTO)
        {
            try
            {
                var empresa = _mapper.Map<Empresa>(empresaCreateDTO);
                _appEmpresa.AddEmpresa(empresa);
                return StatusCode(StatusCodes.Status201Created, empresa);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpGet("obter-empresa-registro")]
        public IActionResult Get()
        {

            try
            {
                var resultado = _appEmpresa.GetAllEmpresa();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }
    }
}
