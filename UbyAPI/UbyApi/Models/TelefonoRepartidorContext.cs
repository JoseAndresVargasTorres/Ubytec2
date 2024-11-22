using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;
public class TelefonoRepartidorContext : DbContext
{
    public DbSet<TelefonoRepartidorItem> TelefonoRepartidor { get; set; } = null!;

    public TelefonoRepartidorContext(DbContextOptions<TelefonoRepartidorContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TelefonoRepartidor
        modelBuilder.Entity<TelefonoRepartidorItem>()
            .HasKey(tr => new {tr.Cedula_Repartidor,tr.Telefono}); // Define la clave primaria

    }
}
