using Microsoft.EntityFrameworkCore;

namespace UbyApi.Models
{
    public class DireccionComercioContext : DbContext
    {
        public DbSet<DireccionComercioItem> DireccionComercio { get; set; } = null!;

        public DireccionComercioContext(DbContextOptions<DireccionComercioContext> options)
            : base(options) 
        {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
