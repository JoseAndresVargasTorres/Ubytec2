using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;


[Route("api/[controller]")]
[ApiController]
public class ReporteVentasController : ControllerBase
{
    private readonly ReporteVentasContext _context;

    public ReporteVentasController(ReporteVentasContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReporteVentasItem>>> GetMiVistaRaw()
    {
        var resultados = await _context.ReporteVentas
            .FromSqlRaw("SELECT * FROM vista_reporte_ventas")
            .ToListAsync();

        return Ok(resultados);
    } 
}