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
    public class RepartidorController : ControllerBase
    {
        private readonly RepartidorContext _context;

        public RepartidorController(RepartidorContext context)
        {
            _context = context;
        }

        // GET: api/Repartidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepartidorItem>>> GetRepartidor()
        {
            return await _context.Repartidor.ToListAsync();
        }

        // GET: api/Repartidor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RepartidorItem>> GetRepartidorItem(int id)
        {
            var repartidorItem = await _context.Repartidor.FindAsync(id);

            if (repartidorItem == null)
            {
                return NotFound();
            }

            return repartidorItem;
        }

        [HttpGet("{Password}/{Usuario}")]
        public async Task<IActionResult> GetRepartidorByPasswordAndUsuario(string Password, string Usuario)
        {
            // Ejecutar el procedimiento almacenado directamente sin intentar componerlo con LINQ
            var result = await _context.Repartidor.FromSqlRaw("EXEC clave_repartidor @Usuario = {0}, @Password = {1}", Usuario, Password).ToListAsync();

            // Si el procedimiento devuelve registros, verifica si los valores son nulos
            if (result.Any())
            {
                // Reemplazar valores nulos si es necesario
                var repartidor = result.FirstOrDefault();
                if (
                    (repartidor.Id == -1)    &&
                    (repartidor.Usuario == "-1") &&
                    (repartidor.Nombre == "-1") &&
                    (repartidor.Password == "-1") &&
                    (repartidor.Disponible == "-1")&&
                    (repartidor.Apellido1 == "-1") &&
                    (repartidor.Apellido2 == "-1") &&
                    (repartidor.Correo == "-1")
                )
                {
                    return Unauthorized("Cédula o contraseña incorrecta.");
                }
                
                return Ok(repartidor);
            }
            else
            {
                return Unauthorized("Cédula o contraseña incorrecta.");
            }
        }

        // PUT: api/Repartidor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRepartidorItem(int id, RepartidorItem repartidorItem)
        {
            if (id != repartidorItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(repartidorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RepartidorItemExists(id))
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

        // POST: api/Repartidor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RepartidorItem>> PostRepartidorItem(RepartidorItem repartidorItem)
        {
            _context.Repartidor.Add(repartidorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRepartidorItem", new { id = repartidorItem.Id }, repartidorItem);
        }

        // DELETE: api/Repartidor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRepartidorItem(int id)
        {
            var repartidorItem = await _context.Repartidor.FindAsync(id);
            if (repartidorItem == null)
            {
                return NotFound();
            }

            _context.Repartidor.Remove(repartidorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RepartidorItemExists(int id)
        {
            return _context.Repartidor.Any(e => e.Id == id);
        }
    }
}
