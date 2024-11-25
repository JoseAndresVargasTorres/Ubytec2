// Controllers/RecepcionPedidoController.cs
using Microsoft.AspNetCore.Mvc;
using UbyApi.Data;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecepcionPedidoController : ControllerBase
    {
        private readonly RecepcionPedidoContext _context;

        public RecepcionPedidoController(RecepcionPedidoContext context)
        {
            _context = context;
        }

        // POST: api/RecepcionPedido/completar
        [HttpPost("completar")]
        public async Task<ActionResult<RecepcionPedidoResponse>> CompletarRecepcion([FromBody] RecepcionPedidoItem request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("Datos de recepción inválidos");
                }

                var resultado = await _context.CompletarRecepcionPedido(
                    request.NumPedido,
                    request.IdRepartidor
                );

                if (!resultado.Exito)
                {
                    return BadRequest(resultado);
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new RecepcionPedidoResponse
                {
                    Mensaje = $"Error interno del servidor: {ex.Message}",
                    Exito = false
                });
            }
        }
    }
}