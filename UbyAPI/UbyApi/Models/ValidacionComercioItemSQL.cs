using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ValidacionComercioItemSQL
{
    [Key]
    [StringLength(20)]
    public required string Cedula_Comercio { get; set; }

    public required int Cedula_Admin { get; set; }

    [Required]
    [StringLength(50)]
    public required string Estado { get; set; }

}