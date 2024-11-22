CREATE TRIGGER trigger_Producto_eliminacion
ON dbo.Producto
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Verifica si el producto est� relacionado con alg�n pedido
    IF EXISTS (
        SELECT 1
        FROM Deleted d
        INNER JOIN dbo.ProductosPedidos pp ON d.id = pp.id_producto
    )
    BEGIN
        RAISERROR ('No se puede eliminar el producto porque est� asociado con pedidos activos.', 16, 1);
        RETURN;
    END;

    -- Si no hay relaci�n, procede con la eliminaci�n
    DELETE FROM dbo.Producto
    WHERE id IN (SELECT id FROM Deleted);
END;
