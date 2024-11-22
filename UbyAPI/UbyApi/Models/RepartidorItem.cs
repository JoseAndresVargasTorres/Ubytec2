using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class RepartidorItem
{
    [Key] // Marca esta propiedad como clave primaria
    public int Id { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Usuario { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Nombre { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Password { get; set; }

    [Required] // Campo obligatorio
    [StringLength(50)] // Define la longitud máxima como 50
    public required string Apellido1 { get; set; }

    [Required] // Campo obligatorio
    [StringLength(64)] // Define la longitud máxima como 50
    public required string Password { get; set; }

    [StringLength(50)] // Campo opcional con longitud máxima de 50
    public required string Apellido2 { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Correo { get; set; }
}

