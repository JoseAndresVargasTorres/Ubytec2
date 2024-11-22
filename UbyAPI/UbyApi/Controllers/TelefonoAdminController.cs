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
    public class TelefonoAdminController : ControllerBase
    {
        private readonly TelefonoAdminContext _context;

        public TelefonoAdminController(TelefonoAdminContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoAdmin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoAdminItem>>> GetTelefonoAdmin()
        {
            return await _context.TelefonoAdmin.ToListAsync();
        }

        // GET: api/TelefonoAdmin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TelefonoAdminItem>>> GetTelefonoAdminItem(int id)
         {
            var telefonos = await _context.TelefonoAdmin
                .Where(t => t.Cedula_Admin == id)
                .ToListAsync();

            if (!telefonos.Any())
            {
                return NotFound();
            }

            return telefonos;
        }

        // PUT: api/TelefonoAdmin/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]

        public async Task<ActionResult<List<TelefonoRepartidorItem>>> PutTelefonoAdminItem(int id, List<TelefonoAdminItem> nuevosTelefonos)

        {
            try
            {
                // 1. Obtener teléfonos existentes
                var telefonosExistentes = await _context.TelefonoAdmin
                    .Where(t => t.Cedula_Admin == id)
                    .ToListAsync();

                // 2. Validar que todos los nuevos teléfonos correspondan al repartidor correcto
                foreach (var telefono in nuevosTelefonos)
                {
                    telefono.Cedula_Admin = id; // Asegurar que el ID sea correcto
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
                            _context.TelefonoAdmin.Remove(telefonosExistentes[i]);
                            _context.TelefonoAdmin.Add(nuevosTelefonos[i]);
                        }
                        else
                        {
                            // Eliminar teléfonos sobrantes
                            _context.TelefonoAdmin.Remove(telefonosExistentes[i]);
                        }
                    }
                }
                else
                {
                    // Hay más teléfonos nuevos que existentes
                    // Primero actualizamos los existentes
                    for (int i = 0; i < telefonosExistentes.Count; i++)
                    {
                        _context.TelefonoAdmin.Remove(telefonosExistentes[i]);
                        _context.TelefonoAdmin.Add(nuevosTelefonos[i]);
                    }

                    // Luego agregamos los nuevos teléfonos adicionales
                    for (int i = telefonosExistentes.Count; i < nuevosTelefonos.Count; i++)
                    {
                        _context.TelefonoAdmin.Add(nuevosTelefonos[i]);
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

        // POST: api/TelefonoAdmin
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<IEnumerable<TelefonoAdminItem>>> PostTelefonoAdminItem(List<TelefonoAdminItem> telefonos)
        {
            try 
            {
                if (telefonos == null || !telefonos.Any())
                {
                    return BadRequest("La lista de teléfonos está vacía");
                }

                foreach (var telefono in telefonos)
                {
                    _context.TelefonoAdmin.Add(telefono);
                }
                
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetTelefonoAdminItem), 
                    new { id = telefonos.First().Cedula_Admin }, 
                    telefonos
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al crear los teléfonos: {ex.Message}");
            }
        }

        // DELETE: api/TelefonoAdmin/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoAdminItem(int id)
        {
            var telefonoAdminItem = await _context.TelefonoAdmin.FindAsync(id);
            if (telefonoAdminItem == null)
            {
                return NotFound();
            }

            _context.TelefonoAdmin.Remove(telefonoAdminItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoAdminItemExists(int id)
        {
            return _context.TelefonoAdmin.Any(e => e.Cedula_Admin == id);
        }
    }
}