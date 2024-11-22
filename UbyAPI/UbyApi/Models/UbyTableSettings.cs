namespace UbyApi.Models;

public class UbyTableSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public CollectionsSettings Collections { get; set; } = null!;
}

public class CollectionsSettings
{
    public string PedidosCliente { get; set; } = null!;
    public string ValidacionComercio { get; set; } = null!;
}