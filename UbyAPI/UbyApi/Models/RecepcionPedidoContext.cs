// Data/RecepcionPedidoContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using UbyApi.Models;

namespace UbyApi.Data
{
    public class RecepcionPedidoContext : DbContext
    {
        public RecepcionPedidoContext(DbContextOptions<RecepcionPedidoContext> options)
            : base(options)
        {
        }

        public async Task<RecepcionPedidoResponse> CompletarRecepcionPedido(int numPedido, int idRepartidor)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@NumPedido", numPedido),
                    new SqlParameter("@IdRepartidor", idRepartidor)
                };

                await Database.ExecuteSqlRawAsync("EXEC sp_CompletarRecepcionPedido @NumPedido, @IdRepartidor", 
                    parameters);

                return new RecepcionPedidoResponse
                {
                    Mensaje = "Pedido completado exitosamente",
                    Exito = true
                };
            }
            catch (Exception ex)
            {
                return new RecepcionPedidoResponse
                {
                    Mensaje = $"Error al completar el pedido: {ex.Message}",
                    Exito = false
                };
            }
        }
    }
}