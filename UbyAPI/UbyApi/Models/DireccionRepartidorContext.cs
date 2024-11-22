using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class DireccionRepartidorContext : DbContext
{
    public DbSet<DireccionRepartidorItem> DireccionRepartidor { get; set; } = null!;

    public DireccionRepartidorContext(DbContextOptions<DireccionRepartidorContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
