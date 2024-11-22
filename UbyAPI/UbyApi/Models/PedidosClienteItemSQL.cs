using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UbyApi.Models;
public class PedidosClienteItemSQL
{
    public required int NumPedido { get; set; }

    public required int CedulaCliente { get; set; }

}