using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class PedidoContext : DbContext
{
    public DbSet<PedidoItem> Pedido { get; set; } = null!;

    public PedidoContext(DbContextOptions<PedidoContext> options)
        : base(options)
    {}
}
