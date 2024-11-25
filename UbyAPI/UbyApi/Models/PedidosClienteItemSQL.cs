using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class PedidosClienteItemSQL
{
    public required int Num_Pedido { get; set; }

    public required int Cedula_Cliente { get; set; }

}