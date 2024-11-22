using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;

public class TelefonoAdminContext : DbContext
{
    public DbSet<TelefonoAdminItem> TelefonoAdmin { get; set; } = null!;

    public TelefonoAdminContext(DbContextOptions<TelefonoAdminContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TelefonoAdmin
        modelBuilder.Entity<TelefonoAdminItem>()
            .HasKey(ta => new {ta.Cedula_Admin,ta.Telefono}); // Define la clave primaria

    }
}
