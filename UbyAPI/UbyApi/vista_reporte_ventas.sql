CREATE VIEW vista_reporte_ventas AS
SELECT 
c.nombre AS Afiliado ,
COUNT(p.nombre) AS Compras ,
SUM(p.monto_total) AS Monto_Total,
SUM(p.monto_total) * 0.13 AS Monto_Servicio

FROM 
[dbo].[ComercioAfiliado] c
JOIN 
  [dbo].[Pedido] p ON c.cedula_juridica = p.cedula_comercio

GROUP BY 
	c.nombre
	

SELECT * FROM vista_reporte_ventas
