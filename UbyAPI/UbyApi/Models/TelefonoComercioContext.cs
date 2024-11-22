using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class TelefonoComercioContext : DbContext
{
    public DbSet<TelefonoComercioItem> TelefonoComercio { get; set; } = null!;

    public TelefonoComercioContext(DbContextOptions<TelefonoComercioContext> options) 
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TelefonoCliente
        modelBuilder.Entity<TelefonoComercioItem>()
            .HasKey(tc => new {tc.Cedula_Comercio,tc.Telefono}); // Define la clave primaria

    }
}
