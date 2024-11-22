using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TelefonoRepartidorController : ControllerBase
    {
        private readonly TelefonoRepartidorContext _context;

        public TelefonoRepartidorController(TelefonoRepartidorContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoRepartidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoRepartidorItem>>> GetTelefonoRepartidor()
        {
            return await _context.TelefonoRepartidor.ToListAsync();
        }

        // GET: api/TelefonoRepartidor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TelefonoRepartidorItem>>> GetTelefonoRepartidorItem(int id)
        {
            var telefonos = await _context.TelefonoRepartidor
                .Where(t => t.Cedula_Repartidor == id)
                .ToListAsync();

            if (!telefonos.Any())
            {
                return NotFound();
            }

            return telefonos;
        }

        // PUT: api/TelefonoRepartidor/5
        [HttpPut("{id}")]
        public async Task<ActionResult<List<TelefonoRepartidorItem>>> PutTelefonoRepartidorItem(int id, List<TelefonoRepartidorItem> nuevosTelefonos)
        {
            try
            {
                // 1. Obtener teléfonos existentes
                var telefonosExistentes = await _context.TelefonoRepartidor
                    .Where(t => t.Cedula_Repartidor == id)
                    .ToListAsync();

                // 2. Validar que todos los nuevos teléfonos correspondan al repartidor correcto
                foreach (var telefono in nuevosTelefonos)
                {
                    telefono.Cedula_Repartidor = id; // Asegurar que el ID sea correcto
                }

                // 3. Realizar la lógica de actualización según la cantidad de teléfonos
                if (nuevosTelefonos.Count <= telefonosExistentes.Count)
                {
                    // Actualizar los teléfonos existentes y eliminar los sobrantes
                    for (int i = 0; i < telefonosExistentes.Count; i++)
                    {
                        if (i < nuevosTelefonos.Count)
                        {
                            // Actualizar teléfono existente
                            _context.TelefonoRepartidor.Remove(telefonosExistentes[i]);
                            _context.TelefonoRepartidor.Add(nuevosTelefonos[i]);
                        }
                        else
                        {
                            // Eliminar teléfonos sobrantes
                            _context.TelefonoRepartidor.Remove(telefonosExistentes[i]);
                        }
                    }
                }
                else
                {
                    // Hay más teléfonos nuevos que existentes
                    // Primero actualizamos los existentes
                    for (int i = 0; i < telefonosExistentes.Count; i++)
                    {
                        _context.TelefonoRepartidor.Remove(telefonosExistentes[i]);
                        _context.TelefonoRepartidor.Add(nuevosTelefonos[i]);
                    }

                    // Luego agregamos los nuevos teléfonos adicionales
                    for (int i = telefonosExistentes.Count; i < nuevosTelefonos.Count; i++)
                    {
                        _context.TelefonoRepartidor.Add(nuevosTelefonos[i]);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(nuevosTelefonos);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar los teléfonos: {ex.Message}");
            }
        }

        // POST: api/TelefonoRepartidor
        [HttpPost]
        public async Task<ActionResult<IEnumerable<TelefonoRepartidorItem>>> PostTelefonoRepartidorItem(List<TelefonoRepartidorItem> telefonos)
        {
            try 
            {
                if (telefonos == null || !telefonos.Any())
                {
                    return BadRequest("La lista de teléfonos está vacía");
                }

                foreach (var telefono in telefonos)
                {
                    _context.TelefonoRepartidor.Add(telefono);
                }
                
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetTelefonoRepartidorItem), 
                    new { id = telefonos.First().Cedula_Repartidor }, 
                    telefonos
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al crear los teléfonos: {ex.Message}");
            }
        }

        // DELETE: api/TelefonoRepartidor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoRepartidorItem(int id)
        {
            var telefonos = await _context.TelefonoRepartidor
                .Where(t => t.Cedula_Repartidor == id)
                .ToListAsync();

            if (!telefonos.Any())
            {
                return NotFound();
            }

            _context.TelefonoRepartidor.RemoveRange(telefonos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoRepartidorItemExists(int id)
        {
            return _context.TelefonoRepartidor.Any(e => e.Cedula_Repartidor == id);
        }
    }
}