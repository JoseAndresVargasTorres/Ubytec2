using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ValidacionComercioItemSQL
{
    [Key]
    [StringLength(20)]
    public required string CedulaComercio { get; set; }

    public required int CedulaAdmin { get; set; }

    [Required]
    [StringLength(50)]
    public required string Estado { get; set; }

}