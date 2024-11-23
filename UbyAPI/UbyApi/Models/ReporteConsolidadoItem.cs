namespace UbyApi.Models;
public class ReporteConsolidadoItem
{
    public string? Cliente { get; set; }

    public string? Nombre { get; set; }

    public int Compras { get; set; }

    public string? Conductor { get; set; }

    public decimal Monto_Total { get; set; }
    public decimal Monto_Servicio { get; set; }
}
