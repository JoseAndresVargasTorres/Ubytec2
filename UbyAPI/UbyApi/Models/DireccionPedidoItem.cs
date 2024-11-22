using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class DireccionPedidoItem
{
    [Key]
    public required int id_pedido { get; set; } // Clave primaria

    [Required]
    [MaxLength(50)]
    public required string Provincia { get; set; } // NVARCHAR(50)

    [Required]
    [MaxLength(50)]
    public required string Canton { get; set; } // NVARCHAR(50)

    [Required]
    [MaxLength(50)]
    public required string Distrito { get; set; } // NVARCHAR(50)
}
