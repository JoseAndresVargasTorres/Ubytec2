using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class DireccionAdministradorItem
{
    [Key]
    public required int Id_Admin { get; set; } // Clave primaria y llave foránea

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