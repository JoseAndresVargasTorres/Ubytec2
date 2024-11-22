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
    public class ProductosPedidosController : ControllerBase
    {
        private readonly ProductosPedidosContext _context;

        public ProductosPedidosController(ProductosPedidosContext context)
        {
            _context = context;
        }

        // GET: api/ProductosPedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductosPedidosItem>>> GetProductosPedidos()
        {
            return await _context.ProductosPedidos.ToListAsync();
        }

        // GET: api/ProductosPedidos/5
        [HttpGet("{num_pedido}")]
        public async Task<ActionResult<IEnumerable<ProductosPedidosItem>>> GetProductosPedidosItemPorPedido(int num_pedido)
        {
            var result = await _context.ProductosPedidos.FromSqlRaw("EXEC ObtenerProductosPorPedido @pedido_id = {0}", num_pedido).ToListAsync();

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        // PUT: api/ProductosPedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductosPedidosItem(int id, ProductosPedidosItem productosPedidosItem)
        {
            if (id != productosPedidosItem.Num_Pedido)
            {
                return BadRequest();
            }

            _context.Entry(productosPedidosItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductosPedidosItemExists(id))
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

        // POST: api/ProductosPedidos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductosPedidosItem>> PostProductosPedidosItem(ProductosPedidosItem productosPedidosItem)
        {
            _context.ProductosPedidos.Add(productosPedidosItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductosPedidosItemExists(productosPedidosItem.Num_Pedido))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductosPedidosItem", new { id = productosPedidosItem.Num_Pedido }, productosPedidosItem);
        }

        // DELETE: api/ProductosPedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductosPedidosItem(int id)
        {
            var productosPedidosItem = await _context.ProductosPedidos.FindAsync(id);
            if (productosPedidosItem == null)
            {
                return NotFound();
            }

            _context.ProductosPedidos.Remove(productosPedidosItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductosPedidosItemExists(int id)
        {
            return _context.ProductosPedidos.Any(e => e.Num_Pedido == id);
        }
    }
}
