using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GerenciamentoProdutos.Domain.DTOs.Create;
using GerenciamentoProdutos.Domain.DTOs.Update;
using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Service;

namespace GerenciamentoProdutos.Main.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuario;
        private readonly IMapper _mapper;

        public UsuarioController(IUsuarioService usuario, IMapper mapper)
        {
            _usuario = usuario;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {

            try
            {
                var resultado = _usuario.GetAllUsuario();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            try
            {
                var resultado = _usuario.GetUsuarioById(id);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        public IActionResult Create([FromBody] UsuarioCreateDTO usuarioCreateDTO)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioCreateDTO);
                _usuario.AddUsuario(usuario);
                return StatusCode(StatusCodes.Status201Created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UsuarioUpdateDTO usuarioUpdateDTO)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioUpdateDTO);

                if (usuario.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (usuario.Id == 0 && id > 0)
                    usuario.Id = id;               

                _usuario.UpdateUsuario(usuario);
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public IActionResult UpdateField([FromRoute] int id, [FromBody] UsuarioUpdateDTO usuarioUpdateDTO)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioUpdateDTO);

                if (usuario.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (usuario.Id == 0 && id > 0)
                    usuario.Id = id;
       

                _usuario.UpdateUsuario(usuario);
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            try
            {
                _usuario.DeleteUsuario(id);
                return StatusCode(StatusCodes.Status204NoContent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
