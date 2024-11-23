using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class ReporteConsolidadoContext : DbContext
{
    public ReporteConsolidadoContext(DbContextOptions<ReporteConsolidadoContext> options) : base(options) { }

    // Mapeo de la vista
    public DbSet<ReporteConsolidadoItem> ReporteVentas { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         // Configurar la entidad como Keyless
        modelBuilder.Entity<ReporteConsolidadoItem>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vista_reporte_consolidacion"); // Nombre de la vista en la base de datos
        });
    }
}
