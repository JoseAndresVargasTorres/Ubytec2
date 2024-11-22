using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class ProductosPedidosItem
{
    // Clave primaria compuesta por 'num_pedido' y 'id_producto'
    [Key, Column(Order = 0)] // Define 'num_pedido' como parte de la clave primaria
    public int Num_Pedido { get; set; }

    [Key, Column(Order = 1)] // Define 'id_producto' como parte de la clave primaria
    public int Id_Producto { get; set; }

}
