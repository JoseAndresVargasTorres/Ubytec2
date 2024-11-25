using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UltimasComprasController : ControllerBase
    {
        private readonly UltimaCompraContext _context;

        public UltimasComprasController(UltimaCompraContext context)
        {
            _context = context;
        }

        // GET: api/UltimasCompras/cliente/{cedula}
        [HttpGet("cliente/{cedula}")]
        public async Task<ActionResult<IEnumerable<UltimaCompraItem>>> GetUltimasCompras(int cedula)
        {
            try
            {
                var compras = await _context.UltimasCompras
                    .Where(c => c.CedulaCliente == cedula)
                    .ToListAsync();

                if (!compras.Any())
                {
                    return NotFound($"No se encontraron compras para el cliente con cédula {cedula}");
                }

                return Ok(compras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/UltimasCompras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UltimaCompraItem>>> GetAllUltimasCompras()
        {
            try
            {
                var compras = await _context.UltimasCompras.ToListAsync();
                
                if (!compras.Any())
                {
                    return NotFound("No se encontraron compras registradas");
                }

                return Ok(compras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/UltimasCompras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UltimaCompraItem>> GetUltimaCompra(int id)
        {
            try
            {
                var ultimaCompra = await _context.UltimasCompras
                    .FirstOrDefaultAsync(c => c.NumPedido == id);

                if (ultimaCompra == null)
                {
                    return NotFound($"No se encontró la compra con ID {id}");
                }

                return Ok(ultimaCompra);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/UltimasCompras/cliente/{cedula}/feedback
        [HttpPost("cliente/{cedula}/feedback")]
        public async Task<IActionResult> AddFeedback(int cedula, [FromBody] FeedbackRequest request)
        {
            try
            {
                var compra = await _context.UltimasCompras
                    .FirstOrDefaultAsync(c => c.CedulaCliente == cedula && c.NumPedido == request.NumPedido);

                if (compra == null)
                {
                    return NotFound($"No se encontró la compra especificada para el cliente {cedula}");
                }

                // Aquí iría la lógica para actualizar el feedback en la base de datos
                // Esto dependerá de tu estructura de base de datos y requerimientos

                return Ok("Feedback agregado exitosamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }

    public class FeedbackRequest
    {
        public int NumPedido { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }
}