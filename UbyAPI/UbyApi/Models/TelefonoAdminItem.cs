using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoAdminItem
{
    // Clave primaria y clave foránea hacia Administrador
    public required int Cedula_Admin { get; set; }

    // Teléfono
    [StringLength(20)] // Define una longitud máxima de 20 caracteres
    public required string Telefono { get; set; }

}
