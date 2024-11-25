// Models/RecepcionPedidoItem.cs
namespace UbyApi.Models
{
    public class RecepcionPedidoItem
    {
        public int NumPedido { get; set; }
        public int IdRepartidor { get; set; }
    }

    public class RecepcionPedidoResponse
    {
        public string? Mensaje { get; set; }
        public bool Exito { get; set; }
    }
}