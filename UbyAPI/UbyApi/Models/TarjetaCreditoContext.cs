using Microsoft.EntityFrameworkCore; 
namespace UbyApi.Models;

public class TarjetaCreditoContext : DbContext
{
    public DbSet<TarjetaCreditoItem> TarjetaCredito { get; set; } = null!;

    public TarjetaCreditoContext(DbContextOptions<TarjetaCreditoContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TarjetaCredito
        modelBuilder.Entity<TarjetaCreditoItem>()
            .HasKey(tc => tc.Numero_Tarjeta); // Define la clave primaria

    }
}
