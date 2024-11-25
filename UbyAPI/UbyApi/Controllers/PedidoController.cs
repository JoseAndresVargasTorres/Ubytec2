using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private readonly PedidoContext _context;

        public PedidoController(PedidoContext context)
        {
            _context = context;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoItem>>> GetPedido()
        {
            return await _context.Pedido.ToListAsync();
        }

        // GET: api/Pedido/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoItem>> GetPedidoItem(int id)
        {
            var pedidoItem = await _context.Pedido.FindAsync(id);

            if (pedidoItem == null)
            {
                return NotFound();
            }

            return pedidoItem;
        }

        // PUT: api/Pedido/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedidoItem(int id, PedidoItem pedidoItem)
        {
            if (id != pedidoItem.Num_Pedido)
            {
                return BadRequest();
            }

            _context.Entry(pedidoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/Pedido/AsignaRepartidor/5
        [HttpPut("AsignaRepartidor/{num_pedido}")]
        public async Task<IActionResult> AsginaRepartidor(int num_pedido)
        {
            var result = await _context.Pedido.FromSqlRaw("EXEC asigna_repartidor @PedidoID = {0};",num_pedido).ToListAsync();

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        // PUT: api/Pedido/RecepcionPedido/5
        [HttpPut("RecepcionPedido/{num_pedido}")]
        public async Task<IActionResult> RecepcionPedido(int num_pedido)
        {
            var result = await _context.Pedido
                .FromSqlRaw("EXEC recepcio_pedido @num_pedido = {0};", num_pedido)
                .ToListAsync();

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        // POST: api/Pedido
        [HttpPost]
        public async Task<ActionResult<PedidoItem>> PostPedidoItem(PedidoItem pedidoItem)
        {
            _context.Pedido.Add(pedidoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPedidoItem", new { id = pedidoItem.Num_Pedido }, pedidoItem);
        }

        // DELETE: api/Pedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedidoItem(int id)
        {
            var pedidoItem = await _context.Pedido.FindAsync(id);
            if (pedidoItem == null)
            {
                return NotFound();
            }

            _context.Pedido.Remove(pedidoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidoItemExists(int id)
        {
            return _context.Pedido.Any(e => e.Num_Pedido == id);
        }
    }
}