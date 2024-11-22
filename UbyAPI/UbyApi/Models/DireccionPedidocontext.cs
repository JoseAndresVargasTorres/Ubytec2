using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class DireccionPedidoContext : DbContext
{
    public DbSet<DireccionPedidoItem> DireccionPedido { get; set; } = null!;

    public DireccionPedidoContext(DbContextOptions<DireccionPedidoContext> options) 
        : base(options) 
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}

