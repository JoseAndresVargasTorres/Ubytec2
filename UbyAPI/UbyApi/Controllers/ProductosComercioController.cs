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
    public class ProductosComercioController : ControllerBase
    {
        private readonly ProductosComercioContext _context;

        public ProductosComercioController(ProductosComercioContext context)
        {
            _context = context;
        }

        // GET: api/ProductosComercio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductosComercioItem>>> GetProductosComercio()
        {
            return await _context.ProductosComercio.ToListAsync();
        }

        // GET: api/ProductosComercio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductosComercioItem>> GetProductosComercioItem(string id)
        {
            var productosComercioItem = await _context.ProductosComercio.FindAsync(id);

            if (productosComercioItem == null)
            {
                return NotFound();
            }

            return productosComercioItem;
        }

        // PUT: api/ProductosComercio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductosComercioItem(string id, ProductosComercioItem productosComercioItem)
        {
            if (id != productosComercioItem.Cedula_Comercio)
            {
                return BadRequest();
            }

            _context.Entry(productosComercioItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductosComercioItemExists(id))
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

        // POST: api/ProductosComercio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductosComercioItem>> PostProductosComercioItem(ProductosComercioItem productosComercioItem)
        {
            _context.ProductosComercio.Add(productosComercioItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductosComercioItemExists(productosComercioItem.Cedula_Comercio))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductosComercioItem", new { id = productosComercioItem.Cedula_Comercio }, productosComercioItem);
        }

        // DELETE: api/ProductosComercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductosComercioItem(string id)
        {
            var productosComercioItem = await _context.ProductosComercio.FindAsync(id);
            if (productosComercioItem == null)
            {
                return NotFound();
            }

            _context.ProductosComercio.Remove(productosComercioItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductosComercioItemExists(string id)
        {
            return _context.ProductosComercio.Any(e => e.Cedula_Comercio == id);
        }
    }
}
