create view vista_admin_comercio as
select
	a.cedula,
	a.nombre,
	a.apellido1,
	a.apellido2,
	a.usuario,
	a.password,
	a.correo
from 
	Administrador a join ComercioAfiliado c on a.cedula = c.cedula_admin