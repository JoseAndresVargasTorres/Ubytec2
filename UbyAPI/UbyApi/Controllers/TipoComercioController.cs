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
    public class TipoComercioController : ControllerBase
    {
        private readonly TipoComercioContext _context;

        public TipoComercioController(TipoComercioContext context)
        {
            _context = context;
        }

        // GET: api/TipoComercio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoComercioItem>>> GetTipoComercio()
        {
            return await _context.TipoComercio.ToListAsync();
        }

        // GET: api/TipoComercio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoComercioItem>> GetTipoComercioItem(int id)
        {
            var tipoComercioItem = await _context.TipoComercio.FindAsync(id);

            if (tipoComercioItem == null)
            {
                return NotFound();
            }

            return tipoComercioItem;
        }

        // PUT: api/TipoComercio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoComercioItem(int id, TipoComercioItem tipoComercioItem)
        {
            if (id != tipoComercioItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(tipoComercioItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoComercioItemExists(id))
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

        // POST: api/TipoComercio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TipoComercioItem>> PostTipoComercioItem(TipoComercioItem tipoComercioItem)
        {
            _context.TipoComercio.Add(tipoComercioItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipoComercioItem", new { id = tipoComercioItem.Id }, tipoComercioItem);
        }

        // DELETE: api/TipoComercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoComercioItem(int id)
        {
            var tipoComercioItem = await _context.TipoComercio.FindAsync(id);
            if (tipoComercioItem == null)
            {
                return NotFound();
            }

            _context.TipoComercio.Remove(tipoComercioItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoComercioItemExists(int id)
        {
            return _context.TipoComercio.Any(e => e.Id == id);
        }
    }
}
