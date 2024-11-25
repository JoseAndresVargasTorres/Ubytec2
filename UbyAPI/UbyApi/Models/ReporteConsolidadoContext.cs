using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;

public class ReporteConsolidadoContext : DbContext
{
    public ReporteConsolidadoContext(DbContextOptions<ReporteConsolidadoContext> options) : base(options) { }

    public DbSet<ReporteConsolidadoItem> ReporteVentas { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ReporteConsolidadoItem>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vista_reporte_consolidacion"); // Asegúrate de que este nombre coincida con tu vista en SQL

            // Mapeo explícito de columnas
            entity.Property(e => e.Cliente).HasColumnName("Cliente");
            entity.Property(e => e.Afiliado).HasColumnName("Afiliado");
            entity.Property(e => e.Conductor).HasColumnName("Conductor");
            entity.Property(e => e.Compras).HasColumnName("Compras");
            entity.Property(e => e.Monto_Total).HasColumnName("Monto_Total");
            entity.Property(e => e.Monto_Servicio).HasColumnName("Monto_Servicio");
        });
    }
}