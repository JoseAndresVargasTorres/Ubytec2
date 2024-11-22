
CREATE PROCEDURE ObtenerProductosPorId
    @id_prod INT
AS
BEGIN
    SELECT * 
    FROM ProductosComercio
    WHERE id_producto = @id_prod;
END;

