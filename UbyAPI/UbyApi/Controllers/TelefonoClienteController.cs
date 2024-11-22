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
    public class TelefonoClienteController : ControllerBase
    {
        private readonly TelefonoClienteContext _context;

        public TelefonoClienteController(TelefonoClienteContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoCliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoClienteItem>>> GetTelefonoCliente()
        {
            return await _context.TelefonoCliente.ToListAsync();
        }

        // GET: api/TelefonoCliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TelefonoClienteItem>>> GetTelefonoClienteItem(int id)
        {
            var telefonos = await _context.TelefonoCliente
                .Where(t => t.Cedula_Cliente == id)
                .ToListAsync();

            if (!telefonos.Any())
            {
                return NotFound();
            }

            return telefonos;
        }

        // PUT: api/TelefonoCliente/5
        [HttpPut("{id}")]
        public async Task<ActionResult<List<TelefonoClienteItem>>> PutTelefonoClienteItem(int id, List<TelefonoClienteItem> nuevosTelefonos)
        {
            try
            {
                // 1. Obtener teléfonos existentes
                var telefonosExistentes = await _context.TelefonoCliente
                    .Where(t => t.Cedula_Cliente == id)
                    .ToListAsync();

                // 2. Validar que todos los nuevos teléfonos correspondan al cliente correcto
                foreach (var telefono in nuevosTelefonos)
                {
                    telefono.Cedula_Cliente = id; // Asegurar que el ID sea correcto
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
                            _context.TelefonoCliente.Remove(telefonosExistentes[i]);
                            _context.TelefonoCliente.Add(nuevosTelefonos[i]);
                        }
                        else
                        {
                            // Eliminar teléfonos sobrantes
                            _context.TelefonoCliente.Remove(telefonosExistentes[i]);
                        }
                    }
                }
                else
                {
                    // Hay más teléfonos nuevos que existentes
                    // Primero actualizamos los existentes
                    for (int i = 0; i < telefonosExistentes.Count; i++)
                    {
                        _context.TelefonoCliente.Remove(telefonosExistentes[i]);
                        _context.TelefonoCliente.Add(nuevosTelefonos[i]);
                    }

                    // Luego agregamos los nuevos teléfonos adicionales
                    for (int i = telefonosExistentes.Count; i < nuevosTelefonos.Count; i++)
                    {
                        _context.TelefonoCliente.Add(nuevosTelefonos[i]);
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

        // POST: api/TelefonoCliente
        [HttpPost]
        public async Task<ActionResult<IEnumerable<TelefonoClienteItem>>> PostTelefonoClienteItem(List<TelefonoClienteItem> telefonos)
        {
            try 
            {
                if (telefonos == null || !telefonos.Any())
                {
                    return BadRequest("La lista de teléfonos está vacía");
                }

                foreach (var telefono in telefonos)
                {
                    _context.TelefonoCliente.Add(telefono);
                }
                
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetTelefonoClienteItem), 
                    new { id = telefonos.First().Cedula_Cliente }, 
                    telefonos
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al crear los teléfonos: {ex.Message}");
            }
        }

        // DELETE: api/TelefonoCliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoClienteItem(int id)
        {
            var telefonosCliente = await _context.TelefonoCliente
                .Where(t => t.Cedula_Cliente == id)
                .ToListAsync();

            if (!telefonosCliente.Any())
            {
                return NotFound();
            }

            _context.TelefonoCliente.RemoveRange(telefonosCliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoClienteItemExists(int id)
        {
            return _context.TelefonoCliente.Any(e => e.Cedula_Cliente == id);
        }
    }
}