using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class RepartidorContext : DbContext
{
    public DbSet<RepartidorItem> Repartidor { get; set; } = null!;

    public RepartidorContext(DbContextOptions<RepartidorContext> options)
        : base(options)
    {}
}
