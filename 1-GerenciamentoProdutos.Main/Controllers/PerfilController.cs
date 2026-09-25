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
    public class PerfilController : ControllerBase
    {
        private readonly IPerfilService _perfil;
        private readonly IMapper _mapper;

        public PerfilController(IPerfilService perfil, IMapper mapper)
        {
            _perfil = perfil;
            _mapper = mapper;

        }

        [HttpGet]
        public IActionResult Get()
        {

            try
            {
                var resultado = _perfil.GetAllPerfil();
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
                var resultado = _perfil.GetPerfilById(id);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        public IActionResult Create([FromBody] PerfilCreateDTO perfilCreateDTO)
        {
            try
            {
                var perfil = _mapper.Map<Perfil>(perfilCreateDTO);
                _perfil.AddPerfil(perfil);
                //return StatusCode(StatusCodes.Status201Created);
                return Ok(perfil);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] PerfilUpdateDTO perfilUpdateDTO)
        {
            try
            {
                var perfil = _mapper.Map<Perfil>(perfilUpdateDTO);

                if (perfil.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (perfil.Id == 0 && id > 0)
                    perfil.Id = id;               

                _perfil.UpdatePerfil(perfil);
                return Ok(perfil);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public IActionResult UpdateField([FromRoute] int id, [FromBody] PerfilUpdateDTO perfilUpdateDTO)
        {
            try
            {
                var perfil = _mapper.Map<Perfil>(perfilUpdateDTO);

                if (perfil.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (perfil.Id == 0 && id > 0)
                    perfil.Id = id;
       

                _perfil.UpdatePerfil(perfil);
                return Ok(perfil);
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
                _perfil.DeletePerfil(id);
                //return StatusCode(StatusCodes.Status204NoContent);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
