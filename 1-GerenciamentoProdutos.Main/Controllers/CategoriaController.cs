using AutoMapper;
using FastReport;
using FastReport.Data;
using FastReport.Export.PdfSimple;
using GerenciamentoProdutos.Domain.DTOs.Create;
using GerenciamentoProdutos.Domain.DTOs.Update;
using GerenciamentoProdutos.Domain.Entities;
using GerenciamentoProdutos.Domain.Interface.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GerenciamentoProdutos.Main.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _Categoria;
        private readonly IMapper _mapper;

        public CategoriaController(ICategoriaService Categoria, IMapper mapper)
        {
            _Categoria = Categoria;
            _mapper = mapper;

        }

        [HttpGet]
        public IActionResult Get()
        {

            try
            {
                var resultado = _Categoria.GetAllCategoria();
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
                var resultado = _Categoria.GetCategoriaById(id);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        public IActionResult Create([FromBody] CategoriaCreateDTO CategoriaCreateDTO)
        {
            try
            {
                var Categoria = _mapper.Map<Categoria>(CategoriaCreateDTO);
                _Categoria.AddCategoria(Categoria);
                //return StatusCode(StatusCodes.Status201Created);
                return Ok(Categoria);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] CategoriaUpdateDTO CategoriaUpdateDTO)
        {
            try
            {
                var Categoria = _mapper.Map<Categoria>(CategoriaUpdateDTO);

                if (Categoria.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (Categoria.Id == 0 && id > 0)
                    Categoria.Id = id;               

                _Categoria.UpdateCategoria(Categoria);
                return Ok(Categoria);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public IActionResult UpdateField([FromRoute] int id, [FromBody] CategoriaUpdateDTO CategoriaUpdateDTO)
        {
            try
            {
                var Categoria = _mapper.Map<Categoria>(CategoriaUpdateDTO);

                if (Categoria.Id == 0 && id == 0)
                    throw new Exception("Id não pode ser zero");
                else if (Categoria.Id == 0 && id > 0)
                    Categoria.Id = id;
       

                _Categoria.UpdateCategoria(Categoria);
                return Ok(Categoria);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("RelatorioPdf")]
        public IActionResult RelatorioPdf()
        {
            try
            {
      
                var caminhoFrx = Path.Combine(AppContext.BaseDirectory, "Reports", "RelatorioCategorias.frx");
                FastReport.Utils.RegisteredObjects.AddConnection(typeof(MsSqlDataConnection));

                using var report = new Report();
                report.Load(caminhoFrx);           

                report.Prepare();

                using var pdfExport = new PDFSimpleExport();
                using var ms = new MemoryStream();
                report.Export(pdfExport, ms);             
                
                return File(ms.ToArray(), "application/pdf", "RelatorioCategorias.pdf");
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
                _Categoria.DeleteCategoria(id);
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
