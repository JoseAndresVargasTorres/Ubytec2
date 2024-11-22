using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class TipoComercioItem
{
    [Key] // Marca esta propiedad como clave primaria
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Configura la columna como Identity
    public int Id { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Nombre { get; set; }
}
