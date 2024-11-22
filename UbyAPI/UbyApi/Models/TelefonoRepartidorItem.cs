using System.ComponentModel.DataAnnotations;

namespace UbyApi.Models;
public class TelefonoRepartidorItem
{
    // Clave primaria y clave foránea hacia Repartidor
    public required int Cedula_Repartidor { get; set; }

    // Teléfono
    [StringLength(20)] // Define una longitud máxima de 20 caracteres
    public required string Telefono { get; set; }
}
