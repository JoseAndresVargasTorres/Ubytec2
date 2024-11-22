using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models;
public class DireccionAdministradorContext : DbContext
{
    public DbSet<DireccionAdministradorItem> DireccionAdministrador {get; set;} = null!;

    public DireccionAdministradorContext(DbContextOptions<DireccionAdministradorContext> options) 
        : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
