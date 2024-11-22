using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;

public class ComercioAfiliadoItem
{
    [Key] // Marca la propiedad como clave primaria
    [StringLength(20)] // Define la longitud máxima como 20
    public required string Cedula_Juridica { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Nombre { get; set; }

    [Required] // Campo obligatorio
    [StringLength(100)] // Define la longitud máxima como 100
    public required string Correo { get; set; }

    [StringLength(50)] // Campo opcional con longitud máxima de 50
    public required string SINPE { get; set; }

    // Propiedad de navegación para la relación con TipoComercio
    public int Id_Tipo { get; set; }

    // Propiedad de navegación para la relación con Administrador
    public int Cedula_Admin { get; set; }
}
