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
    public class ValidacionComercioControllerSQL : ControllerBase
    {
        private readonly ValidacionComercioContextSQL _context;

        public ValidacionComercioControllerSQL(ValidacionComercioContextSQL context)
        {
            _context = context;
        }

        // GET: api/ValidacionComercioControllerSQL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ValidacionComercioItemSQL>>> GetValidacionesComercio()
        {
            return await _context.ValidacionesComercio.ToListAsync();
        }

        // GET: api/ValidacionComercioControllerSQL/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ValidacionComercioItemSQL>> GetValidacionComercioItemSQL(string id)
        {
            var validacionComercioItemSQL = await _context.ValidacionesComercio.FindAsync(id);

            if (validacionComercioItemSQL == null)
            {
                return NotFound();
            }

            return validacionComercioItemSQL;
        }

        // PUT: api/ValidacionComercioControllerSQL/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutValidacionComercioItemSQL(string id, ValidacionComercioItemSQL validacionComercioItemSQL)
        {
            if (id != validacionComercioItemSQL.CedulaComercio)
            {
                return BadRequest();
            }

            _context.Entry(validacionComercioItemSQL).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ValidacionComercioItemSQLExists(id))
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

        // POST: api/ValidacionComercioControllerSQL
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ValidacionComercioItemSQL>> PostValidacionComercioItemSQL(ValidacionComercioItemSQL validacionComercioItemSQL)
        {
            _context.ValidacionesComercio.Add(validacionComercioItemSQL);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ValidacionComercioItemSQLExists(validacionComercioItemSQL.CedulaComercio))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetValidacionComercioItemSQL", new { id = validacionComercioItemSQL.CedulaComercio }, validacionComercioItemSQL);
        }

        // DELETE: api/ValidacionComercioControllerSQL/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteValidacionComercioItemSQL(string id)
        {
            var validacionComercioItemSQL = await _context.ValidacionesComercio.FindAsync(id);
            if (validacionComercioItemSQL == null)
            {
                return NotFound();
            }

            _context.ValidacionesComercio.Remove(validacionComercioItemSQL);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ValidacionComercioItemSQLExists(string id)
        {
            return _context.ValidacionesComercio.Any(e => e.CedulaComercio == id);
        }
    }
}
