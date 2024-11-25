// Models/UltimaCompraItem.cs
public class UltimaCompraItem
{
    public int CedulaCliente { get; set; }
    public int NumPedido { get; set; }
    public string ComercioAfiliado { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public string? Feedback { get; set; }
    public string Estado { get; set; } = string.Empty;
}