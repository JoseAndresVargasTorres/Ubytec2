
using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class AdministradorItem 
{
    [Key] // Marca esta propiedad como clave primaria
    [Required] // Indica que este campo es obligatorio
    public int Cedula { get; set; }

        [Required] // Campo obligatorio
        [StringLength(50)] // Define la longitud máxima como 50
        public required string Usuario { get; set; }

        [Required] // Campo obligatorio
        [StringLength(64)] // Define la longitud máxima como 50
        public required string Password { get; set; }

        [Required] // Campo obligatorio
        [StringLength(50)] // Define la longitud máxima como 50
        public required string Nombre { get; set; }

        [Required] // Campo obligatorio
        [StringLength(50)] // Define la longitud máxima como 50
        public required string Apellido1 { get; set; }

        [StringLength(50)] // Campo opcional con longitud máxima de 50
        public required string Apellido2 { get; set; }

        [StringLength(50)]
        [EmailAddress] // Valida que el formato sea de correo electrónico
        public string? Correo { get; set; }
}