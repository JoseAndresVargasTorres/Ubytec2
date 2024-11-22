using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosClienteControllerSQL : ControllerBase
    {
        private readonly PedidosClienteContextSQL _context;

        public PedidosClienteControllerSQL(PedidosClienteContextSQL context)
        {
            _context = context;
        }

        // GET: api/PedidosClienteControllerSQL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidosClienteItemSQL>>> GetPedidosClientes()
        {
            return await _context.PedidosClientes.ToListAsync();
        }

        // GET: api/PedidosClienteControllerSQL/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidosClienteItemSQL>> GetPedidosClienteItemSQL(int id)
        {
            var pedidosClienteItemSQL = await _context.PedidosClientes.FindAsync(id);

            if (pedidosClienteItemSQL == null)
            {
                return NotFound();
            }

            return pedidosClienteItemSQL;
        }

        // PUT: api/PedidosClienteControllerSQL/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedidosClienteItemSQL(int id, PedidosClienteItemSQL pedidosClienteItemSQL)
        {
            if (id != pedidosClienteItemSQL.NumPedido)
            {
                return BadRequest();
            }

            _context.Entry(pedidosClienteItemSQL).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidosClienteItemSQLExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PedidosClienteControllerSQL
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PedidosClienteItemSQL>> PostPedidosClienteItemSQL(PedidosClienteItemSQL pedidosClienteItemSQL)
        {
            _context.PedidosClientes.Add(pedidosClienteItemSQL);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PedidosClienteItemSQLExists(pedidosClienteItemSQL.NumPedido))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPedidosClienteItemSQL", new { id = pedidosClienteItemSQL.NumPedido }, pedidosClienteItemSQL);
        }

        // DELETE: api/PedidosClienteControllerSQL/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedidosClienteItemSQL(int id)
        {
            var pedidosClienteItemSQL = await _context.PedidosClientes.FindAsync(id);
            if (pedidosClienteItemSQL == null)
            {
                return NotFound();
            }

            _context.PedidosClientes.Remove(pedidosClienteItemSQL);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidosClienteItemSQLExists(int id)
        {
            return _context.PedidosClientes.Any(e => e.NumPedido == id);
        }
    }
}
