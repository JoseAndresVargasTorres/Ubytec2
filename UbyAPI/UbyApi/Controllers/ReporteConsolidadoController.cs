using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

[Route("api/[controller]")]
[ApiController]
public class ReporteConsolidadoController : ControllerBase
{
    private readonly ReporteConsolidadoContext _context;

    public ReporteConsolidadoController(ReporteConsolidadoContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReporteConsolidadoItem>>> GetReporteConsolidado()
    {
        try
        {
            var resultados = await _context.ReporteVentas
                .FromSqlRaw("SELECT * FROM vista_reporte_consolidacion")
                .ToListAsync();

            if (!resultados.Any())
            {
                return NotFound("No se encontraron datos para el reporte");
            }

            return Ok(resultados);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error al obtener el reporte: {ex.Message}");
        }
    }
}