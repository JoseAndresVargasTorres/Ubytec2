 VIEW vista_reporte_ganancia_prom AS

SELECT 
c.nombre AS Afiliado ,
COUNT(p.nombre) AS Productos ,
AVG(prod.precio) AS Promedio_ganancia

FROM 
[dbo].[ComercioAfiliado] c
JOIN 
  [dbo].[Pedido] p ON c.cedula_juridica = p.cedula_comercio

JOIN 
 [dbo].[ProductosPedidos] pr ON p.num_pedido = pr.num_pedido

 JOIN 
[dbo].[Producto] prod ON pr.id_producto = prod.id
   
WHERE 
	p.estado = 'Entregado'

GROUP BY 
	c.nombre

SELECT * FROM vista_reporte_ganancia_prom

INSERT INTO [dbo].[ProductosPedidos] (num_pedido,id_producto)
VALUES (14,4),(14,6)