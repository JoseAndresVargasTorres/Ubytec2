// Data/UltimaCompraContext.cs
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class UltimaCompraContext : DbContext
{
    public UltimaCompraContext(DbContextOptions<UltimaCompraContext> options)
        : base(options)
    {
    }

    required public virtual DbSet<UltimaCompraItem> UltimasCompras { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UltimaCompraItem>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("VW_UltimasCompras");

            entity.Property(e => e.CedulaCliente).HasColumnName("cedula_cliente");
            entity.Property(e => e.NumPedido).HasColumnName("num_pedido");
            entity.Property(e => e.ComercioAfiliado).HasColumnName("comercio_afiliado");
            entity.Property(e => e.MontoTotal).HasColumnName("monto_total");
            entity.Property(e => e.Feedback).HasColumnName("feedback");
            entity.Property(e => e.Estado).HasColumnName("estado");
        });
    }
}