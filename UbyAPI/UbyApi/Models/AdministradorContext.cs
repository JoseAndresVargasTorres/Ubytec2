using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

public class AdministradorContext : DbContext
{

    public AdministradorContext(DbContextOptions<AdministradorContext> options)
        : base(options)
    {}

    public DbSet<AdministradorItem> Administrador { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdministradorItem>()
            .ToTable("Administrador", t => t.HasTrigger("trig_contraseña")); // Asegura que EF sepa que la tabla tiene un trigger.
    }
}
