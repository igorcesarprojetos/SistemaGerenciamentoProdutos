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
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaService _empresa;
        private readonly IMapper _mapper;

        public EmpresaController(IEmpresaService empresa, IMapper mapper)
        {
            _empresa = empresa;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {

            try
            {
                var resultado = _empresa.GetAllEmpresa();
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
                var resultado = _empresa.GetEmpresaById(id);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        public IActionResult Create([FromBody] EmpresaCreateDTO empresaCreateDTO)
        {
            try
            {
                var empresa = _mapper.Map<Empresa>(empresaCreateDTO);
                _empresa.AddEmpresa(empresa);              
                return StatusCode(StatusCodes.Status201Created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] EmpresaUpdateDTO empresaUpdateDTO)
        {
            try
            {
                var empresa = _mapper.Map<Empresa>(empresaUpdateDTO);

                if (empresa.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (empresa.Id == 0 && id > 0)
                    empresa.Id = id;               

                _empresa.UpdateEmpresa(empresa);
                return Ok(empresa);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public IActionResult UpdateField([FromRoute] int id, [FromBody] EmpresaUpdateDTO empresaUpdateDTO)
        {
            try
            {
                var empresa = _mapper.Map<Empresa>(empresaUpdateDTO);

                if (empresa.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (empresa.Id == 0 && id > 0)
                    empresa.Id = id;
       

                _empresa.UpdateEmpresa(empresa);
                return Ok(empresa);
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
                _empresa.DeleteEmpresa(id);
                return StatusCode(StatusCodes.Status204NoContent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
