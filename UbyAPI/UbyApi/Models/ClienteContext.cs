using Microsoft.EntityFrameworkCore;
using UbyApi.Models;
public class ClienteContext : DbContext
{
    public DbSet<ClienteItem> Cliente { get; set; } = null!;

    public ClienteContext(DbContextOptions<ClienteContext> options)
        : base(options)
    {}

  protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClienteItem>()
            .ToTable("Cliente", t => t.HasTrigger("trig_contraseña")); // Asegura que EF sepa que la tabla tiene un trigger.
    }
}
