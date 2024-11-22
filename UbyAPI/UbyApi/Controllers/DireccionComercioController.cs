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
    public class DireccionComercioController : ControllerBase
    {
        private readonly DireccionComercioContext _context;

        public DireccionComercioController(DireccionComercioContext context)
        {
            _context = context;
        }

        // GET: api/DireccionComercio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionComercioItem>>> GetDireccionComercio()
        {
            return await _context.DireccionComercio.ToListAsync();
        }

        // GET: api/DireccionComercio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionComercioItem>> GetDireccionComercioItem(string id)
        {
            var direccionComercioItem = await _context.DireccionComercio.FindAsync(id);

            if (direccionComercioItem == null)
            {
                return NotFound();
            }

            return direccionComercioItem;
        }

        // PUT: api/DireccionComercio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionComercioItem(string id, DireccionComercioItem direccionComercioItem)
        {
            if (id != direccionComercioItem.Id_Comercio)
            {
                return BadRequest();
            }

            _context.Entry(direccionComercioItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionComercioItemExists(id))
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

        // POST: api/DireccionComercio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DireccionComercioItem>> PostDireccionComercioItem(DireccionComercioItem direccionComercioItem)
        {
            _context.DireccionComercio.Add(direccionComercioItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DireccionComercioItemExists(direccionComercioItem.Id_Comercio))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDireccionComercioItem", new { id = direccionComercioItem.Id_Comercio }, direccionComercioItem);
        }

        // DELETE: api/DireccionComercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionComercioItem(string id)
        {
            var direccionComercioItem = await _context.DireccionComercio.FindAsync(id);
            if (direccionComercioItem == null)
            {
                return NotFound();
            }

            _context.DireccionComercio.Remove(direccionComercioItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionComercioItemExists(string id)
        {
            return _context.DireccionComercio.Any(e => e.Id_Comercio == id);
        }
    }
}
