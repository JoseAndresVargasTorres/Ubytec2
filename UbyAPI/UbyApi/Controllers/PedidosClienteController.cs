using Microsoft.AspNetCore.Mvc;
using UbyApi.Models;
using UbyApi.Services;

namespace BookStoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosClienteController : ControllerBase
{
    private readonly UbyTableService _ubyTableService;

    public PedidosClienteController(UbyTableService ubyTableService) =>
        _ubyTableService = ubyTableService;

    [HttpGet]
    public async Task<List<PedidosClienteItem>> Get() =>
        await _ubyTableService.GetPedidosClienteItemAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<PedidosClienteItem>> Get(string id)
    {
        var pedidoCliente = await _ubyTableService.GetPedidosClienteItemAsync(id);

        if (pedidoCliente is null)
        {
            return NotFound();
        }

        return pedidoCliente;
    }

    [HttpPost]
    public async Task<IActionResult> Post(PedidosClienteItem newPedidoClienteItem)
    {
        await _ubyTableService.CreatePedidosClienteItemAsync(newPedidoClienteItem);

        return CreatedAtAction(nameof(Get), new { id = newPedidoClienteItem.Id }, newPedidoClienteItem);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, PedidosClienteItem updatedPedidosClienteItem)
    {
        var pedidosCliente = await _ubyTableService.GetPedidosClienteItemAsync(id);

        if (pedidosCliente is null)
        {
            return NotFound();
        }

        pedidosCliente.Id = pedidosCliente.Id;

        await _ubyTableService.UpdatePedidosClienteItemAsync(id, updatedPedidosClienteItem);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var pedidoCliente = await _ubyTableService.GetPedidosClienteItemAsync(id);

        if (pedidoCliente is null)
        {
            return NotFound();
        }

        await _ubyTableService.RemovePedidosClienteItemAsync(id);

        return NoContent();
    }
}