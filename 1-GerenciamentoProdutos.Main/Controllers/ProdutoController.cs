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
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _Produto;
        private readonly IMapper _mapper;

        public ProdutoController(IProdutoService Produto, IMapper mapper)
        {
            _Produto = Produto;
            _mapper = mapper;

        }

        [HttpGet]
        public IActionResult Get()
        {

            try
            {
                var resultado = _Produto.GetAllProduto();
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
                var resultado = _Produto.GetProdutoById(id);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        public IActionResult Create([FromBody] ProdutoCreateDTO ProdutoCreateDTO)
        {
            try
            {
                var Produto = _mapper.Map<Produto>(ProdutoCreateDTO);
                _Produto.AddProduto(Produto);
                //return StatusCode(StatusCodes.Status201Created);
                return Ok(Produto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] ProdutoUpdateDTO ProdutoUpdateDTO)
        {
            try
            {
                var Produto = _mapper.Map<Produto>(ProdutoUpdateDTO);

                if (Produto.Id == 0 && id == 0)
                    throw new Exception("Id n„o pode ser zero");
                else if (Produto.Id == 0 && id > 0)
                    Produto.Id = id;               

                _Produto.UpdateProduto(Produto);
                return Ok(Produto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public IActionResult UpdateField([FromRoute] int id, [FromBody] ProdutoUpdateDTO ProdutoUpdateDTO)
        {
            try
            {
                var Produto = _mapper.Map<Produto>(ProdutoUpdateDTO);

                if (Produto.Id == 0 && id == 0)
                    throw new Exception("Id n„o pode ser zero");
                else if (Produto.Id == 0 && id > 0)
                    Produto.Id = id;
       

                _Produto.UpdateProduto(Produto);
                return Ok(Produto);
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
                //var produtos = _Produto.GetAllProduto();

                //// Monta um DataTable para alimentar o relat√≥rio (registrado como fonte de dados)
                //var dt = new DataTable("Produto");
                //dt.Columns.Add("Codigo", typeof(long));
                //dt.Columns.Add("Nome", typeof(string));
                //dt.Columns.Add("Descricao", typeof(string));
                //dt.Columns.Add("Marca", typeof(string));
                //dt.Columns.Add("Categoria", typeof(string));
                //dt.Columns.Add("QuantidadeEstoque", typeof(int));
                //dt.Columns.Add("Preco", typeof(decimal));

                //foreach (var p in produtos)
                //{
                //    dt.Rows.Add(p.Codigo, p.Nome, p.Descricao, p.Marca, p.Categoria, p.QuantidadeEstoque, p.Preco);
                //}

                var caminhoFrx = Path.Combine(AppContext.BaseDirectory, "Reports", "RelatorioProdutos.frx");
                FastReport.Utils.RegisteredObjects.AddConnection(typeof(MsSqlDataConnection));

                using var report = new Report();
                report.Load(caminhoFrx);

                //report.RegisterData(dt, "Produto");
                // RegisterData registra a fonte desabilitada por padr√£o; √© preciso habilitar.
                //var dataSource = report.GetDataSource("Produto");
                //if (dataSource != null)
                //    dataSource.Enabled = true;

                report.Prepare();

                using var pdfExport = new PDFSimpleExport();
                using var ms = new MemoryStream();
                report.Export(pdfExport, ms);

                //var url = $"{Request.Scheme}://{Request.Host}/relatorios/RelatorioProdutos.pdf";
                
                //return Ok(new { url, arquivo =File(ms.ToArray(), "application/pdf", "RelatorioProdutos.pdf").FileContents});
                
                return File(ms.ToArray(), "application/pdf", "RelatorioProdutos.pdf");
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
                _Produto.DeleteProduto(id);
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
