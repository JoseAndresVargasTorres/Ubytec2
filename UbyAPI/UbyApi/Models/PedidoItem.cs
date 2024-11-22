using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class PedidoItem
{
    [Key] // Marca esta propiedad como clave primaria
    public int Num_Pedido { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Nombre { get; set; }

    [StringLength(50)] // Campo opcional con longitud máxima de 50
    public required string Estado { get; set; }

    [Required] // Campo obligatorio
    [Column(TypeName = "decimal(10, 2)")] // Define el tipo decimal con precisión y escala
    public decimal Monto_Total { get; set; }

    // Relación con Repartidor
    public int Id_Repartidor { get; set; } // Clave foránea opcional

    // Relación con ComercioAfiliado
    [StringLength(20)] // Coincide con el tipo y longitud de cedula_juridica en ComercioAfiliado
    public required string Cedula_Comercio { get; set; } // Clave foránea opcional
}

