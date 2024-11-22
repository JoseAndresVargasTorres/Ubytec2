using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class ClienteItem
    {
    [Key] // Marca esta propiedad como clave primaria
    public int Cedula { get; set; }


    [Required]
    [StringLength(50)]
    public required string Usuario { get; set; }  // Agregar este campo


    [Required] // Campo obligatorio
    [StringLength(200)] // Define la longitud máxima como 50
    public required string Password { get; set; }
    
    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Usuario { get; set; }


    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Nombre { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Apellido1 { get; set; }

    [StringLength(50)] // Campo opcional con longitud máxima de 50
    public required string Apellido2 { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Correo { get; set; }

    // Campo opcional con tipo de datos DATE
    public DateTime Fecha_Nacimiento { get; set; } // Se permite null para casos donde no se proporcione la fecha
}
