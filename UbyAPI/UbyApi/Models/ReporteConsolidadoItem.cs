namespace UbyApi.Models;

public class ReporteConsolidadoItem
{
    public string? Cliente { get; set; }
    public string? Afiliado { get; set; }
    public string? Conductor { get; set; }
    public int Compras { get; set; }
    public decimal Monto_Total { get; set; }
    public decimal Monto_Servicio { get; set; }
}
