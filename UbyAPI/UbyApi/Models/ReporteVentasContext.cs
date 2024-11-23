using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class ReporteVentasContext : DbContext
{
    public ReporteVentasContext(DbContextOptions<ReporteVentasContext> options) : base(options) { }

    // Mapeo de la vista
    public DbSet<ReporteVentasItem> ReporteVentas { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         // Configurar la entidad como Keyless
        modelBuilder.Entity<ReporteVentasItem>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vista_reporte_ventas"); // Nombre de la vista en la base de datos
        });
    }
}
