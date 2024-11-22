using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class DireccionClienteContext : DbContext
{

    // Corregido - ahora referencia a DireccionCliente
    public DbSet<DireccionClienteItem> DireccionCliente { get; set; } = null!;

    public DireccionClienteContext(DbContextOptions<DireccionClienteContext> options) 
        : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

}
