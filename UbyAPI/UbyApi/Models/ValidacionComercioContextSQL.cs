using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class ValidacionComercioContextSQL : DbContext
{
    public ValidacionComercioContextSQL(DbContextOptions<ValidacionComercioContextSQL> options) : base(options)
    {
    }

    public DbSet<ValidacionComercioItemSQL> ValidacionesComercio { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ValidacionComercioItemSQL>()
            .HasKey(vc => vc.CedulaComercio);

    }
}
