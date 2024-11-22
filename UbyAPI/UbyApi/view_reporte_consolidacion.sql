VIEW vista_reporte_consolidacion AS

SELECT 

cl.nombre AS Cliente ,
ca.nombre,
COUNT(p.nombre) AS Compras ,
r.nombre AS Conductor,
SUM(p.monto_total) AS Monto_Total,
SUM(p.monto_total) * 0.13 AS Monto_Servicio


FROM 
[dbo].[Cliente] cl
JOIN 
  [dbo].[PedidosCliente] pc ON cl.cedula = pc.cedula_cliente 

JOIN 
[dbo].[Pedido] p ON pc.num_pedido = p.num_pedido

JOIN [dbo].[Repartidor] r ON p.id_repartidor = r.id

JOIN 
[dbo].[ComercioAfiliado] ca ON p.cedula_comercio = ca.cedula_juridica

WHERE 

	p.estado = 'Entregado'


GROUP BY 
	cl.nombre,
	ca.nombre,
	r.nombre
	
	

SELECT * FROM vista_reporte_consolidacion

INSERT INTO dbo.PedidosCliente (num_pedido,cedula_cliente)
VALUES (14,1)
INSERT INTO dbo.PedidosCliente (num_pedido,cedula_cliente)
VALUES (16,2)