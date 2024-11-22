using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DireccionClienteController : ControllerBase
    {
        private readonly DireccionClienteContext _context;

        public DireccionClienteController(DireccionClienteContext context)
        {
            _context = context;
        }

        // GET: api/DireccionCliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionClienteItem>>> GetDireccionCliente()
        {
            try
            {
                var direcciones = await _context.DireccionCliente.ToListAsync();
                return Ok(direcciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las direcciones", error = ex.Message });
            }
        }

        // GET: api/DireccionCliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionClienteItem>> GetDireccionClienteItem(string id)
        {
            try
            {
                if (!int.TryParse(id, out int idInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                var direccionCliente = await _context.DireccionCliente
                    .FirstOrDefaultAsync(d => d.Id_Cliente == idInt);

                if (direccionCliente == null)
                {
                    return NotFound(new { message = $"No se encontró la dirección para el cliente con ID {id}" });
                }

                return Ok(direccionCliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener la dirección", error = ex.Message });
            }
        }

        // POST: api/DireccionCliente
        [HttpPost]
        public async Task<ActionResult<DireccionClienteItem>> PostDireccionClienteItem([FromBody] DireccionClienteItem direccion)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos de la dirección inválidos", errors = ModelState });
                }

                // Validar que no exista una dirección para ese cliente
                if (await _context.DireccionCliente.AnyAsync(d => d.Id_Cliente == direccion.Id_Cliente))
                {
                    return BadRequest(new { message = $"Ya existe una dirección para el cliente con ID {direccion.Id_Cliente}" });
                }

                // Validar campos requeridos
                if (string.IsNullOrWhiteSpace(direccion.Provincia) ||
                    string.IsNullOrWhiteSpace(direccion.Canton) ||
                    string.IsNullOrWhiteSpace(direccion.Distrito))
                {
                    return BadRequest(new { message = "Todos los campos de la dirección son requeridos" });
                }

                _context.DireccionCliente.Add(direccion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDireccionClienteItem), 
                    new { id = direccion.Id_Cliente }, direccion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear la dirección", error = ex.Message });
            }
        }

        // PUT: api/DireccionCliente/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionClienteItem(string id, [FromBody] DireccionClienteItem direccion)
        {
            try
            {
                if (!int.TryParse(id, out int idInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                if (idInt != direccion.Id_Cliente)
                {
                    return BadRequest(new { message = "El ID no coincide con la dirección a actualizar" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos de la dirección inválidos", errors = ModelState });
                }

                // Validar campos requeridos
                if (string.IsNullOrWhiteSpace(direccion.Provincia) ||
                    string.IsNullOrWhiteSpace(direccion.Canton) ||
                    string.IsNullOrWhiteSpace(direccion.Distrito))
                {
                    return BadRequest(new { message = "Todos los campos de la dirección son requeridos" });
                }

                _context.Entry(direccion).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Dirección actualizada exitosamente", direccion });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DireccionClienteExists(idInt))
                    {
                        return NotFound(new { message = $"No se encontró la dirección para el cliente con ID {id}" });
                    }
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar la dirección", error = ex.Message });
            }
        }

        // DELETE: api/DireccionCliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionClienteItem(string id)
        {
            try
            {
                if (!int.TryParse(id, out int idInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                var direccion = await _context.DireccionCliente
                    .FirstOrDefaultAsync(d => d.Id_Cliente == idInt);

                if (direccion == null)
                {
                    return NotFound(new { message = $"No se encontró la dirección para el cliente con ID {id}" });
                }

                _context.DireccionCliente.Remove(direccion);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Dirección eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar la dirección", error = ex.Message });
            }
        }

        private bool DireccionClienteExists(int id)
        {
            return _context.DireccionCliente.Any(e => e.Id_Cliente == id);
        }
    }
}