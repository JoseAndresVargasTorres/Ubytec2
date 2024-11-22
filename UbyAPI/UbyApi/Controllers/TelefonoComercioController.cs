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
    public class TelefonoComercioController : ControllerBase
    {
        private readonly TelefonoComercioContext _context;

        public TelefonoComercioController(TelefonoComercioContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoComercio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoComercioItem>>> GetTelefonoComercio()
        {
            return await _context.TelefonoComercio.ToListAsync();
        }

        // GET: api/TelefonoComercio/5
       [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TelefonoComercioItem>>> GetTelefonoComercioItem(int id)
        {
            var idString = id.ToString();
            var telefonos = await _context.TelefonoComercio
                .Where(t => t.Cedula_Comercio == idString)
                .ToListAsync();

            if (!telefonos.Any())
            {
                return NotFound();
            }

            return telefonos;
        }

        // PUT: api/TelefonoComercio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<List<TelefonoComercioItem>>> PutTelefonoComercioItem(int id, List<TelefonoComercioItem> nuevosTelefonos)
        {

            try
            {
                // 1. Obtener teléfonos existentes
                
                var idString = id.ToString();
                var telefonosExistentes = await _context.TelefonoComercio
                    .Where(t => t.Cedula_Comercio == idString)
                    .ToListAsync();

                // 2. Validar que todos los nuevos teléfonos correspondan al repartidor correcto
                foreach (var telefono in nuevosTelefonos)
                {
                    telefono.Cedula_Comercio = id.ToString(); // Convertimos el id (int) a string y lo asignamos
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
                            _context.TelefonoComercio.Remove(telefonosExistentes[i]);
                            _context.TelefonoComercio.Add(nuevosTelefonos[i]);
                        }
                        else
                        {
                            // Eliminar teléfonos sobrantes
                            _context.TelefonoComercio.Remove(telefonosExistentes[i]);
                        }
                    }
                }
                else
                {
                    // Hay más teléfonos nuevos que existentes
                    // Primero actualizamos los existentes
                    for (int i = 0; i < telefonosExistentes.Count; i++)
                    {
                        _context.TelefonoComercio.Remove(telefonosExistentes[i]);
                        _context.TelefonoComercio.Add(nuevosTelefonos[i]);
                    }

                    // Luego agregamos los nuevos teléfonos adicionales
                    for (int i = telefonosExistentes.Count; i < nuevosTelefonos.Count; i++)
                    {
                        _context.TelefonoComercio.Add(nuevosTelefonos[i]);
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


        // POST: api/TelefonoComercio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<IEnumerable<TelefonoComercioItem>>> PostTelefonoComercioItem(List<TelefonoComercioItem> telefonos)
        {
            try 
            {
                if (telefonos == null || !telefonos.Any())
                {
                    return BadRequest("La lista de teléfonos está vacía");
                }

                foreach (var telefono in telefonos)
                {
                    _context.TelefonoComercio.Add(telefono);
                }
                
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetTelefonoComercioItem), 
                    new { id = telefonos.First().Cedula_Comercio }, 
                    telefonos
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al crear los teléfonos: {ex.Message}");
            }
        }

        // DELETE: api/TelefonoComercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoComercioItem(string id)
        {
            var telefonoComercioItem = await _context.TelefonoComercio.FindAsync(id);
            if (telefonoComercioItem == null)
            {
                return NotFound();
            }

            _context.TelefonoComercio.Remove(telefonoComercioItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoComercioItemExists(string id)
        {
            return _context.TelefonoComercio.Any(e => e.Cedula_Comercio == id);
        }
    }
}
