using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class ValidacionComercioItem
{
    // Clave primaria de MongoDB, generalmente '_id' es la clave primaria
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)] // Convierte string a ObjectId automáticamente
    public string? Id { get; set; }  // MongoDB usa ObjectId por defecto para el campo '_id'

    // Clave foránea única hacia ComercioAfiliado (usamos string por el ejemplo)
    [BsonElement("CedulaComercio")]
    public required string CedulaComercio { get; set; }

    // Comentario opcional (Texto largo)
    [BsonElement("Comentario")]
    public string? Comentario { get; set; }

    // Estado
    [BsonElement("Estado")]
    public required string Estado { get; set; }
}
