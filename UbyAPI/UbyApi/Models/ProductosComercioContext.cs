using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;
public class ProductosComercioContext : DbContext
{
    public DbSet<ProductosComercioItem> ProductosComercio { get; set; } = null!;

    public ProductosComercioContext(DbContextOptions<ProductosComercioContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar las relaciones
        modelBuilder.Entity<ProductosComercioItem>()
            .HasKey(pc => new { pc.Cedula_Comercio, pc.Id_Producto }); // Clave primaria compuesta

    }
}
