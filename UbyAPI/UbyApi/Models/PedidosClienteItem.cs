using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UbyApi.Models;
 public class PedidosClienteItem
    {
        // MongoDB requiere un campo Id como clave primaria
        [BsonId] // Indica que esta es la clave primaria
        [BsonRepresentation(BsonType.ObjectId)] // Convierte string a ObjectId automáticamente
        public string? Id { get; set; }

        // Número de pedido
        [BsonElement("NumPedido")] // Campo almacenado en MongoDB
        public int NumPedido { get; set; }

        // Cédula del cliente (clave foránea)
        [BsonElement("CedulaCliente")]
        public int CedulaCliente { get; set; }

        // Feedback opcional
        [BsonElement("Feedback")]
        public string? Feedback { get; set; }
    }