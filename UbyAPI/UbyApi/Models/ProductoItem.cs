using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class ProductoItem
{
    [Key] // Marca esta propiedad como clave primaria
    public int Id { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Nombre { get; set; }

    [StringLength(50)] // Campo opcional con longitud máxima de 50
    public required string Categoria { get; set; }

    [Required] // Campo obligatorio
    [Column(TypeName = "decimal(10, 2)")] // Define el tipo decimal con precisión y escala
    public required decimal Precio { get; set; }
}
