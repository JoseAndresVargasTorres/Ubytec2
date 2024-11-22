using UbyApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace UbyApi.Services;

public class UbyTableService
{
    private readonly IMongoCollection<PedidosClienteItem> _pedidosClienteCollection;
    private readonly IMongoCollection<ValidacionComercioItem> _validacionComercioCollection;

    public UbyTableService(
        IOptions<UbyTableSettings> ubyTableSettings)
    {
        var mongoClient = new MongoClient(
            ubyTableSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            ubyTableSettings.Value.DatabaseName);

        // Inicializar las colecciones
        _pedidosClienteCollection = mongoDatabase.GetCollection<PedidosClienteItem>(
            ubyTableSettings.Value.Collections.PedidosCliente);
        _validacionComercioCollection = mongoDatabase.GetCollection<ValidacionComercioItem>(
            ubyTableSettings.Value.Collections.ValidacionComercio);
        
    }

    
    
    public async Task<List<PedidosClienteItem>> GetPedidosClienteItemAsync() =>
        await _pedidosClienteCollection.Find(_ => true).ToListAsync();

    public async Task<PedidosClienteItem?> GetPedidosClienteItemAsync(string id) =>
        await _pedidosClienteCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreatePedidosClienteItemAsync(PedidosClienteItem newPedidosClienteItem) =>
        await _pedidosClienteCollection.InsertOneAsync(newPedidosClienteItem);

    public async Task UpdatePedidosClienteItemAsync(string id, PedidosClienteItem updatedPedidosClienteItem) =>
        await _pedidosClienteCollection.ReplaceOneAsync(x => x.Id == id, updatedPedidosClienteItem);

    public async Task RemovePedidosClienteItemAsync(string id) =>
        await _pedidosClienteCollection.DeleteOneAsync(x => x.Id == id);

    public async Task<List<ValidacionComercioItem>> GetValidacionComercioAsync() =>
        await _validacionComercioCollection.Find(_ => true).ToListAsync();

    public async Task<ValidacionComercioItem?> GetValidacionComercioAsync(string id) =>
        await _validacionComercioCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateValidacionComercioAsync(ValidacionComercioItem newValidacionComercioItem) =>
        await _validacionComercioCollection.InsertOneAsync(newValidacionComercioItem);

    public async Task UpdateValidacionComercioAsync(string id, ValidacionComercioItem updatedValidacionComercioItem) =>
        await _validacionComercioCollection.ReplaceOneAsync(x => x.Id == id, updatedValidacionComercioItem);

    public async Task RemoveValidacionComercioAsync(string id) =>
        await _validacionComercioCollection.DeleteOneAsync(x => x.Id == id);
}