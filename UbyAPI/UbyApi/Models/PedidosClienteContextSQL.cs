using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class PedidosClienteContextSQL : DbContext
{
    public PedidosClienteContextSQL(DbContextOptions<PedidosClienteContextSQL> options) : base(options)
    {
    }

    public DbSet<PedidosClienteItemSQL> PedidosClientes { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PedidosClienteItemSQL>()
            .HasKey(pc => new { pc.NumPedido, pc.CedulaCliente });

    }
}