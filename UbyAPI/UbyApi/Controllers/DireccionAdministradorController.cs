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
    public class DireccionAdministradorController : ControllerBase
    {
        private readonly DireccionAdministradorContext _context;

        public DireccionAdministradorController(DireccionAdministradorContext context)
        {
            _context = context;
        }

        // GET: api/DireccionAdministrador
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionAdministradorItem>>> GetDireccionAdministrador()
        {
            try
            {
                var direcciones = await _context.DireccionAdministrador.ToListAsync();
                return Ok(direcciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las direcciones", error = ex.Message });
            }
        }

        // GET: api/DireccionAdministrador/5
        [HttpGet("{id_Admin}")]
        public async Task<ActionResult<DireccionAdministradorItem>> GetDireccionAdministradorItem(string id_Admin)
        {
            try
            {
                if (!int.TryParse(id_Admin, out int id_AdminInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                var direccionAdmin = await _context.DireccionAdministrador
                    .FirstOrDefaultAsync(d => d.Id_Admin == id_AdminInt);

                if (direccionAdmin == null)
                {
                    return NotFound(new { message = $"No se encontró la dirección para el administrador con ID {id_Admin}" });
                }

                return Ok(direccionAdmin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener la dirección", error = ex.Message });
            }
        }

        // POST: api/DireccionAdministrador
        [HttpPost]
        public async Task<ActionResult<DireccionAdministradorItem>> PostDireccionAdministradorItem([FromBody] DireccionAdministradorItem direccion)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos de la dirección inválidos", errors = ModelState });
                }

                // Validar que no exista una dirección para ese administrador
                if (await _context.DireccionAdministrador.AnyAsync(d => d.Id_Admin == direccion.Id_Admin))
                {
                    return BadRequest(new { message = $"Ya existe una dirección para el administrador con ID {direccion.Id_Admin}" });
                }

                // Validar campos requeridos
                if (string.IsNullOrWhiteSpace(direccion.Provincia) ||
                    string.IsNullOrWhiteSpace(direccion.Canton) ||
                    string.IsNullOrWhiteSpace(direccion.Distrito))
                {
                    return BadRequest(new { message = "Todos los campos de la dirección son requeridos" });
                }

                _context.DireccionAdministrador.Add(direccion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDireccionAdministradorItem), 
                    new { id_Admin = direccion.Id_Admin }, direccion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear la dirección", error = ex.Message });
            }
        }

        // PUT: api/DireccionAdministrador/5
        [HttpPut("{id_Admin}")]
        public async Task<IActionResult> PutDireccionAdministradorItem(string id_Admin, [FromBody] DireccionAdministradorItem direccion)
        {
            try
            {
                if (!int.TryParse(id_Admin, out int id_AdminInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                if (id_AdminInt != direccion.Id_Admin)
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
                    if (!DireccionAdministradorExists(id_AdminInt))
                    {
                        return NotFound(new { message = $"No se encontró la dirección para el administrador con ID {id_Admin}" });
                    }
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar la dirección", error = ex.Message });
            }
        }

        // DELETE: api/DireccionAdministrador/5
        [HttpDelete("{id_Admin}")]
        public async Task<IActionResult> DeleteDireccionAdministradorItem(string id_Admin)
        {
            try
            {
                if (!int.TryParse(id_Admin, out int id_AdminInt))
                {
                    return BadRequest(new { message = "El ID debe ser un número válido" });
                }

                var direccion = await _context.DireccionAdministrador
                    .FirstOrDefaultAsync(d => d.Id_Admin == id_AdminInt);

                if (direccion == null)
                {
                    return NotFound(new { message = $"No se encontró la dirección para el administrador con ID {id_Admin}" });
                }

                _context.DireccionAdministrador.Remove(direccion);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Dirección eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar la dirección", error = ex.Message });
            }
        }

        private bool DireccionAdministradorExists(int id_Admin)
        {
            return _context.DireccionAdministrador.Any(e => e.Id_Admin == id_Admin);
        }
    }
}