using Microsoft.AspNetCore.Mvc;
using UbyApi.Services;
using UbyApi.Models;

namespace UbyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValidacionComercioController : ControllerBase
{
    private readonly UbyTableService _ubyTableService;

    public ValidacionComercioController(UbyTableService ubyTableService) =>
        _ubyTableService = ubyTableService;

    [HttpGet]
    public async Task<List<ValidacionComercioItem>> Get() =>
        await _ubyTableService.GetValidacionComercioAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<ValidacionComercioItem>> Get(string id)
    {
        var validacionComercio = await _ubyTableService.GetValidacionComercioAsync(id);

        if (validacionComercio is null)
        {
            return NotFound();
        }

        return validacionComercio;
    }

    [HttpPost]
    public async Task<IActionResult> Post(ValidacionComercioItem newValidacionComercioItem)
    {
        await _ubyTableService.CreateValidacionComercioAsync(newValidacionComercioItem);

        return CreatedAtAction(nameof(Get), new { id = newValidacionComercioItem.Id }, newValidacionComercioItem);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, ValidacionComercioItem updatedValidacionComercioItem)
    {
        var validacionComercio = await _ubyTableService.GetValidacionComercioAsync(id);

        if (validacionComercio is null)
        {
            return NotFound();
        }

        updatedValidacionComercioItem.Id = validacionComercio.Id;

        await _ubyTableService.UpdateValidacionComercioAsync(id, updatedValidacionComercioItem);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var validacionComercio = await _ubyTableService.GetValidacionComercioAsync(id);
        if (validacionComercio is null)
        {
            return NotFound();
        }

        await _ubyTableService.RemoveValidacionComercioAsync(id);

        return NoContent();
    }
}