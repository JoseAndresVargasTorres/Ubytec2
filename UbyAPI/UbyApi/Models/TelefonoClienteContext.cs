using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;

public class TelefonoClienteContext : DbContext
{
    public DbSet<TelefonoClienteItem> TelefonoCliente { get; set; } = null!;

    public TelefonoClienteContext(DbContextOptions<TelefonoClienteContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TelefonoCliente
        modelBuilder.Entity<TelefonoClienteItem>()
            .HasKey(tc => new {tc.Cedula_Cliente,tc.Telefono}); // Define la clave primaria

    }
}
