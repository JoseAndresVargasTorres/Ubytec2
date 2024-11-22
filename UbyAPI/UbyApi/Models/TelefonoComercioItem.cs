using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoComercioItem
{
    public required string Cedula_Comercio { get; set; } // Clave primaria y llave foránea

    [Required]
    [MaxLength(20)]
    public required string Telefono { get; set; } // NVARCHAR(20)
}