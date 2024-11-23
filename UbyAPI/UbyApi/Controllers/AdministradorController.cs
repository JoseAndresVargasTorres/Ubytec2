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
    public class AdministradorController : ControllerBase
    {
        private readonly AdministradorContext _context;

        public AdministradorController(AdministradorContext context)
        {
            _context = context;
        }

        // GET: api/Administrador
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdministradorItem>>> GetAdministrador()
        {
            try
            {
                var administradores = await _context.Administrador.ToListAsync();
                return Ok(administradores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener administradores", error = ex.Message });
            }
        }
        
         // GET: api/Administrador
        [HttpGet("AdminComercio")]
        public async Task<ActionResult<IEnumerable<AdministradorItem>>> GetAdministradorComercio()
        {
            try
            {
                var resultados = await _context.Administrador
                    .FromSqlRaw("SELECT * FROM vista_admin_comercio")
                    .ToListAsync();

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener administradores", error = ex.Message });
            }
        }

        // GET: api/Administrador/5
        [HttpGet("{cedula}")]
        public async Task<ActionResult<AdministradorItem>> GetAdministradorItem(string cedula)
        {
            try
            {
                if (!int.TryParse(cedula, out int cedulaInt))
                {
                    return BadRequest(new { message = "La cédula debe ser un número válido" });
                }

                var administrador = await _context.Administrador.FindAsync(cedulaInt);

                if (administrador == null)
                {
                    return NotFound(new { message = $"No se encontró el administrador con cédula {cedula}" });
                }

                return Ok(administrador);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener el administrador", error = ex.Message });
            }
        }

         [HttpGet("{Password}/{Usuario}")]
        public async Task<IActionResult> GetAdministradorByPasswordAndUsuario(string Password, string Usuario)
        {
            // Ejecutar el procedimiento almacenado directamente sin intentar componerlo con LINQ
            var result = await _context.Administrador.FromSqlRaw("EXEC clave_administrador @Usuario = {0}, @Password = {1}", Usuario, Password).ToListAsync();

            // Si el procedimiento devuelve registros, verifica si los valores son nulos
            if (result.Any())
            {
                // Reemplazar valores nulos si es necesario
                var admin = result.FirstOrDefault();
                if (
                    (admin.Cedula == -1)    &&
                    (admin.Usuario == "-1") &&
                    (admin.Password == "-1") &&
                    (admin.Nombre == "-1") &&
                    (admin.Apellido1 == "-1") &&
                    (admin.Apellido2 == "-1") &&
                    (admin.Correo == "-1")
                )
                {
                    return Unauthorized("Cédula o contraseña incorrecta.");
                }
                
                return Ok(admin);
            }
            else
            {
                return Unauthorized("Cédula o contraseña incorrecta.");
            }
        }

        // POST: api/Administrador
        [HttpPost]
        public async Task<ActionResult<AdministradorItem>> PostAdministradorItem([FromBody] AdministradorItem administrador)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos del administrador inválidos", errors = ModelState });
                }

                // Validar que la cédula no exista
                if (await _context.Administrador.AnyAsync(a => a.Cedula == administrador.Cedula))
                {
                    return BadRequest(new { message = $"Ya existe un administrador con la cédula {administrador.Cedula}" });
                }

                _context.Administrador.Add(administrador);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAdministradorItem), 
                    new { cedula = administrador.Cedula }, administrador);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el administrador", error = ex.Message });
            }
        }

        // PUT: api/Administrador/5
        [HttpPut("{cedula}")]
        public async Task<IActionResult> PutAdministradorItem(string cedula, [FromBody] AdministradorItem administrador)
        {
            try
            {
                if (!int.TryParse(cedula, out int cedulaInt))
                {
                    return BadRequest(new { message = "La cédula debe ser un número válido" });
                }

                if (cedulaInt != administrador.Cedula)
                {
                    return BadRequest(new { message = "La cédula no coincide con el administrador a actualizar" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos del administrador inválidos", errors = ModelState });
                }

                _context.Entry(administrador).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Administrador actualizado exitosamente" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AdministradorExists(cedulaInt))
                    {
                        return NotFound(new { message = $"No se encontró el administrador con cédula {cedula}" });
                    }
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar el administrador", error = ex.Message });
            }
        }

        // DELETE: api/Administrador/5
        [HttpDelete("{cedula}")]
        public async Task<IActionResult> DeleteAdministradorItem(string cedula)
        {
            try
            {
                if (!int.TryParse(cedula, out int cedulaInt))
                {
                    return BadRequest(new { message = "La cédula debe ser un número válido" });
                }

                var administrador = await _context.Administrador.FindAsync(cedulaInt);
                if (administrador == null)
                {
                    return NotFound(new { message = $"No se encontró el administrador con cédula {cedula}" });
                }

                _context.Administrador.Remove(administrador);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Administrador eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar el administrador", error = ex.Message });
            }
        }

        private bool AdministradorExists(int cedula)
        {
            return _context.Administrador.Any(e => e.Cedula == cedula);
        }
    }
}