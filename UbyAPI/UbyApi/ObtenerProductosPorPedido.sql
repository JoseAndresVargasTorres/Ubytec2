CREATE PROCEDURE ObtenerProductosPorPedido
    @pedido_id INT
AS
BEGIN
    SELECT *
    FROM ProductosPedidos
    WHERE num_pedido = @pedido_id;
END;