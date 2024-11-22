-- Población de tabla Administrador (30 registros)
INSERT INTO Administrador (cedula, usuario, password, nombre, apellido1, apellido2) VALUES
(101, 'admin_juan', 'Pass2024!', 'Juan', 'Pérez', 'Gómez'),
(102, 'admin_maria', 'Segura123', 'María', 'García', 'López'),
(103, 'admin_carlos', 'Clave456', 'Carlos', 'Rodríguez', 'Martínez'),
(104, 'admin_ana', 'Acceso789', 'Ana', 'Sánchez', 'Vargas'),
(105, 'admin_jose', 'Secreto321', 'José', 'Fernández', 'Cruz'),
(106, 'admin_laura', 'Clave654', 'Laura', 'Jiménez', 'Herrera'),
(107, 'admin_pedro', 'Seguro987', 'Pedro', 'Mora', 'Ramírez'),
(108, 'admin_sofia', 'Acceso246', 'Sofía', 'Arias', 'Corrales'),
(109, 'admin_david', 'Clave135', 'David', 'Salas', 'Navarro'),
(110, 'admin_monica', 'Seguro357', 'Mónica', 'Álvarez', 'Castillo'),
(111, 'admin_antonio', 'Acceso468', 'Antonio', 'Ruiz', 'Chaves'),
(112, 'admin_diana', 'Clave579', 'Diana', 'Gutiérrez', 'Solano'),
(113, 'admin_manuel', 'Seguro246', 'Manuel', 'Méndez', 'Acosta'),
(114, 'admin_elena', 'Acceso135', 'Elena', 'Castro', 'Zamora'),
(115, 'admin_javier', 'Clave789', 'Javier', 'Blanco', 'Rojas'),
(116, 'admin_lucia', 'Seguro456', 'Lucía', 'Marín', 'Cortés'),
(117, 'admin_miguel', 'Acceso987', 'Miguel', 'Núñez', 'Montero'),
(118, 'admin_patricia', 'Clave246', 'Patricia', 'Solís', 'Brenes'),
(119, 'admin_rafael', 'Seguro135', 'Rafael', 'Trejos', 'Madriz'),
(120, 'admin_paula', 'Acceso579', 'Paula', 'Quesada', 'Araya'),
(121, 'admin_francisco', 'Clave357', 'Francisco', 'Hernández', 'Vindas'),
(122, 'admin_alejandra', 'Seguro468', 'Alejandra', 'Campos', 'Porras'),
(123, 'admin_oscar', 'Acceso654', 'Óscar', 'Vargas', 'Esquivel'),
(124, 'admin_isabel', 'Clave246', 'Isabel', 'Murillo', 'Céspedes'),
(125, 'admin_julio', 'Seguro789', 'Julio', 'Rojas', 'Aguilar'),
(126, 'admin_karen', 'Acceso357', 'Karen', 'Mora', 'Sánchez'),
(127, 'admin_ernesto', 'Clave468', 'Ernesto', 'Castro', 'Jiménez'),
(128, 'admin_valeria', 'Seguro579', 'Valeria', 'Arias', 'Rodríguez'),
(129, 'admin_rodrigo', 'Acceso135', 'Rodrigo', 'Fernández', 'Gómez'),
(130, 'admin_camila', 'Clave987', 'Camila', 'Navarro', 'López');

-- Población de tabla TipoComercio (30 registros)
INSERT INTO TipoComercio (nombre) VALUES
('Restaurante'),
('Supermercado'),
('Farmacia'),
('Cafetería'),
('Panadería'),
('Carnicería'),
('Heladería'),
('Librería'),
('Ferretería'),
('Zapatería'),
('Peluquería'),
('Gimnasio'),
('Óptica'),
('Veterinaria'),
('Lavandería'),
('Tintorería'),
('Pizzería'),
('Bar'),
('Vivero'),
('Pastelería'),
('Pescadería'),
('Joyería'),
('Florería'),
('Tienda de electrónica'),
('Tienda de ropa'),
('Tienda de deportes'),
('Centro de belleza'),
('Tienda de muebles'),
('Tienda de mascotas'),
('Tienda de música');

-- Población de tabla ComercioAfiliado (30 registros)
INSERT INTO ComercioAfiliado (cedula_juridica, nombre, correo, SINPE, id_tipo, cedula_admin) VALUES
('3101234567', 'Restaurante El Buen Sabor', 'contacto@buensabor.com', '8801234567', 1, 101),
('3107654321', 'Supermercado El Ahorro', 'info@ahorro.com', '8807654321', 2, 102),
('3102345678', 'Farmacia Central', 'ventas@farmaciacentral.com', '8802345678', 3, 103),
('3108765432', 'Cafetería Aroma', 'contacto@cafeaRoma.com', '8808765432', 4, 104),
('3103456789', 'Panadería San José', 'pedidos@panaderiasanjose.com', '8803456789', 5, 105),
('3109876543', 'Carnicería Don Pepe', 'contacto@carniceriadonpepe.com', '8809876543', 6, 106),
('3104567890', 'Heladería Tropical', 'ventas@heladeriasantropical.com', '8804567890', 7, 107),
('3110987654', 'Librería Cultura', 'info@libreriacultura.com', '8810987654', 8, 108),
('3105678901', 'Ferretería El Constructor', 'contacto@ferreteriaelconstructor.com', '8805678901', 9, 109),
('3111234567', 'Zapatería Confort', 'ventas@zapateriaconfort.com', '8811234567', 10, 110),
('3106789012', 'Peluquería Elegance', 'citas@peluqueriaelegance.com', '8806789012', 11, 111),
('3112345678', 'Gimnasio Power', 'info@gimnasiopower.com', '8812345678', 12, 112),
('3107890123', 'Óptica Visión', 'contacto@opticavision.com', '8807890123', 13, 113),
('3113456789', 'Veterinaria San Canino', 'atencion@veterinariasancanino.com', '8813456789', 14, 114),
('3108901234', 'Lavandería Express', 'servicio@lavanderiaexpress.com', '8808901234', 15, 115),
('3114567890', 'Tintorería Limpieza Total', 'contacto@tintoreria.com', '8814567890', 16, 116),
('3109012345', 'Pizzería Italia', 'pedidos@pizzeriaitalia.com', '8809012345', 17, 117),
('3115678901', 'Bar El Rincón', 'reservas@barelrincon.com', '8815678901', 18, 118),
('3110123456', 'Vivero Verde', 'ventas@vivero.com', '8810123456', 19, 119),
('3116789012', 'Pastelería Dulce Momento', 'pedidos@pasteleriadulcemomento.com', '8816789012', 20, 120),
('3111234567', 'Pescadería Mar Fresco', 'contacto@pescaderiamarfresco.com', '8811234567', 21, 121),
('3117890123', 'Joyería Brillantes', 'ventas@joyeriabrillos.com', '8817890123', 22, 122),
('3112345678', 'Florería Primavera', 'contacto@floreriaprimavera.com', '8812345678', 23, 123),
('3118901234', 'Tienda Electrónica Tech', 'ventas@tiendatech.com', '8818901234', 24, 124),
('3113456789', 'Tienda de Ropa Moda', 'contacto@tiendamoda.com', '8813456789', 25, 125),
('3119012345', 'Tienda Deportiva Champion', 'productos@tiendachampion.com', '8819012345', 26, 126),
('3114567890', 'Centro de Belleza Glamour', 'citas@centroglamour.com', '8814567890', 27, 127),
('3120123456', 'Mueblería El Descanso', 'ventas@muebleria.com', '8820123456', 28, 128),
('3115678901', 'Tienda de Mascotas Amigos Peludos', 'productos@amigospeludos.com', '8815678901', 29, 129);

-- Población de tabla Producto (30 registros)
INSERT INTO Producto (nombre, categoria, precio) VALUES
('Pizza Familiar', 'Comida Rápida', 12.50),
('Arroz 1kg', 'Granos', 1.25),
('Paracetamol 500mg', 'Medicamentos', 0.75),
('Café Molido 250g', 'Bebidas', 4.50),
('Pan Integral', 'Panadería', 2.00),
('Pollo Entero', 'Carnes', 8.75),
('Helado de Chocolate', 'Postres', 3.25),
('Libro de Cocina', 'Libros', 15.99),
('Martillo', 'Herramientas', 6.50),
('Zapatos Deportivos', 'Calzado', 45.00),
('Corte de Cabello', 'Servicios de Belleza', 10.00),
('Membresía Gimnasio', 'Servicios', 35.00),
('Examen de Vista', 'Servicios de Salud', 25.00),
('Vacuna para Perro', 'Servicios Veterinarios', 20.00),
('Lavado de Ropa', 'Servicios de Limpieza', 8.50),
('Limpieza en Seco', 'Servicios de Limpieza', 12.00),
('Pizza Mediana', 'Comida Rápida', 8.75),
('Cerveza Artesanal', 'Bebidas Alcohólicas', 3.50),
('Planta de Interior', 'Plantas', 15.00),
('Pastel de Chocolate', 'Postres', 22.50),
('Filete de Pescado', 'Pescados', 10.25),
('Anillo de Plata', 'Joyería', 75.00),
('Ramo de Rosas', 'Flores', 25.00),
('Auriculares Bluetooth', 'Electrónica', 45.99),
('Camiseta Deportiva', 'Ropa Deportiva', 29.99),
('Balón de Fútbol', 'Deportes', 20.00),
('Tratamiento Facial', 'Servicios de Belleza', 35.00),
('Sofá de Tres Plazas', 'Muebles', 350.00),
('Alimento para Gatos', 'Mascotas', 12.50),
('Audífonos', 'Electrónica', 80.00);

-- Población de tabla Repartidor (30 registros)
INSERT INTO Repartidor (id, usuario, nombre, apellido1, apellido2, correo) VALUES
(1, 'repartidor_carlos', 'Carlos', 'Rodríguez', 'López', 'carlos.rodriguez@empresa.com'),
(2, 'repartidor_ana', 'Ana', 'Martínez', 'Cruz', 'ana.martinez@empresa.com'),
(3, 'repartidor_luis', 'Luis', 'Hernández', 'Gómez', 'luis.hernandez@empresa.com'),
(4, 'repartidor_maria', 'María', 'Sánchez', 'Pérez', 'maria.sanchez@empresa.com'),
(5, 'repartidor_jose', 'José', 'García', 'Ramírez', 'jose.garcia@empresa.com'),
(6, 'repartidor_sofia', 'Sofía', 'Fernández', 'Vargas', 'sofia.fernandez@empresa.com'),
(7, 'repartidor_david', 'David', 'Mora', 'Jiménez', 'david.mora@empresa.com'),
(8, 'repartidor_laura', 'Laura', 'Castro', 'Navarro', 'laura.castro@empresa.com'),
(9, 'repartidor_pablo', 'Pablo', 'Rojas', 'Acosta', 'pablo.rojas@empresa.com'),
(10, 'repartidor_elena', 'Elena', 'Alvarado', 'Solano', 'elena.alvarado@empresa.com'),
(11, 'repartidor_juan', 'Juan', 'Arias', 'Chaves', 'juan.arias@empresa.com'),
(12, 'repartidor_monica', 'Mónica', 'Méndez', 'Cortés', 'monica.mendez@empresa.com'),
(13, 'repartidor_francisco', 'Francisco', 'Blanco', 'Madriz', 'francisco.blanco@empresa.com'),
(14, 'repartidor_isabel', 'Isabel', 'Núñez', 'Trejos', 'isabel.nuñez@empresa.com'),
(15, 'repartidor_manuel', 'Manuel', 'Quesada', 'Brenes', 'manuel.quesada@empresa.com'),
(16, 'repartidor_karen', 'Karen', 'Villalobos', 'Esquivel', 'karen.villalobos@empresa.com'),
(17, 'repartidor_ernesto', 'Ernesto', 'Campos', 'Salas', 'ernesto.campos@empresa.com'),
(18, 'repartidor_valeria', 'Valeria', 'Ramirez','Rodriguez','Valeria.ramerez@.com');


-- Población de tabla Cliente (30 registros)
INSERT INTO Cliente (cedula, password, nombre, usuario, apellido1, apellido2, correo, fecha_nacimiento) VALUES
(201, 'Clave123!', 'Juan', 'juan_perez', 'Pérez', 'Gómez', 'juan.perez@email.com', '1990-05-15'),
(202, 'Seguro456@', 'María', 'maria_garcia', 'García', 'López', 'maria.garcia@email.com', '1985-11-22'),
(203, 'Acceso789#', 'Carlos', 'carlos_rodriguez', 'Rodríguez', 'Martínez', 'carlos.rodriguez@email.com', '1988-03-10'),
(204, 'Password246$', 'Ana', 'ana_sanchez', 'Sánchez', 'Vargas', 'ana.sanchez@email.com', '1992-07-18'),
(205, 'Clave579%', 'José', 'jose_fernandez', 'Fernández', 'Cruz', 'jose.fernandez@email.com', '1975-09-05'),
(206, 'Seguro135^', 'Laura', 'laura_jimenez', 'Jiménez', 'Herrera', 'laura.jimenez@email.com', '1993-12-30'),
(207, 'Acceso468*', 'Pedro', 'pedro_mora', 'Mora', 'Ramírez', 'pedro.mora@email.com', '1980-06-25'),
(208, 'Clave987!', 'Sofía', 'sofia_arias', 'Arias', 'Corrales', 'sofia.arias@email.com', '1987-02-14'),
(209, 'Seguro246@', 'David', 'david_salas', 'Salas', 'Navarro', 'david.salas@email.com', '1995-08-07'),
(210, 'Acceso135#', 'Mónica', 'monica_alvarez', 'Álvarez', 'Castillo', 'monica.alvarez@email.com', '1983-04-19'),
(211, 'Clave357$', 'Antonio', 'antonio_ruiz', 'Ruiz', 'Chaves', 'antonio.ruiz@email.com', '1990-11-11'),
(212, 'Seguro468%', 'Diana', 'diana_gutierrez', 'Gutiérrez', 'Solano', 'diana.gutierrez@email.com', '1986-01-26'),
(213, 'Acceso579^', 'Manuel', 'manuel_mendez', 'Méndez', 'Acosta', 'manuel.mendez@email.com', '1991-07-03'),
(214, 'Clave789*', 'Elena', 'elena_castro', 'Castro', 'Zamora', 'elena.castro@email.com', '1984-10-16'),
(215, 'Seguro135!', 'Javier', 'javier_blanco', 'Blanco', 'Rojas', 'javier.blanco@email.com', '1989-05-22'),
(216, 'Acceso246@', 'Lucía', 'lucia_marin', 'Marín', 'Cortés', 'lucia.marin@email.com', '1993-03-08'),
(217, 'Clave357#', 'Miguel', 'miguel_nuñez', 'Núñez', 'Montero', 'miguel.nuñez@email.com', '1982-12-01'),
(218, 'Seguro468$', 'Patricia', 'patricia_solis', 'Solís', 'Brenes', 'patricia.solis@email.com', '1986-09-14'),
(219, 'Acceso135%', 'Rafael', 'rafael_trejos', 'Trejos', 'Madriz', 'rafael.trejos@email.com', '1991-06-27'),
(220, 'Clave246^', 'Paula', 'paula_quesada', 'Quesada', 'Araya', 'paula.quesada@email.com', '1988-02-05'),
(221, 'Seguro357*', 'Francisco', 'francisco_hernandez', 'Hernández', 'Vindas', 'francisco.hernandez@email.com', '1985-11-19'),
(222, 'Acceso468!', 'Alejandra', 'alejandra_campos', 'Campos', 'Porras', 'alejandra.campos@email.com', '1994-04-30'),
(223, 'Clave579@', 'Óscar', 'oscar_vargas', 'Vargas', 'Esquivel', 'oscar.vargas@email.com', '1981-08-12'),
(224, 'Seguro789#', 'Isabel', 'isabel_murillo', 'Murillo', 'Céspedes', 'isabel.murillo@email.com', '1990-01-07'),
(225, 'Acceso135$', 'Julio', 'julio_rojas', 'Rojas', 'Aguilar', 'julio.rojas@email.com', '1987-05-17'),
(226, 'Clave246%', 'Karen', 'karen_mora', 'Mora', 'Sánchez', 'karen.mora@email.com', '1992-10-23'),
(227, 'Seguro357^', 'Ernesto', 'ernesto_castro', 'Castro', 'Jiménez', 'ernesto.castro@email.com', '1983-07-09'),
(228, 'Acceso468*', 'Valeria', 'valeria_arias', 'Arias', 'Rodríguez', 'valeria.arias@email.com', '1989-03-13'),
(229, 'Clave135!', 'Rodrigo', 'rodrigo_fernandez', 'Fernández', 'Gómez', 'rodrigo.fernandez@email.com', '1986-12-06'),
(230, 'Seguro246@', 'Camila', 'camila_navarro', 'Navarro', 'López', 'camila.navarro@email.com', '1993-09-21');

-- Población de tabla Pedido (30 registros)
INSERT INTO Pedido (nombre, estado, monto_total, id_repartidor, cedula_comercio) VALUES
('Pedido Juan - Pizza y Bebidas', 'Entregado', 35.50, 1, '3101234567'),
('Pedido María - Compra Supermercado', 'En Proceso', 45.75, 2, '3107654321'),
('Pedido Carlos - Medicamentos', 'Pendiente', 22.50, 3, '3102345678'),
('Pedido Ana - Desayuno', 'Entregado', 15.25, 4, '3108765432'),
('Pedido José - Carne y Pan', 'En Proceso', 28.00, 5, '3103456789'),
('Pedido Laura - Helados', 'Entregado', 18.75, 6, '3109876543'),
('Pedido Pedro - Útiles de Librería', 'Pendiente', 55.50, 7, '3104567890'),
('Pedido Sofía - Herramientas', 'Entregado', 42.25, 8, '3110987654'),
('Pedido David - Zapatos', 'En Proceso', 89.99, 9, '3105678901'),
('Pedido Mónica - Corte de Cabello', 'Pendiente', 25.00, 10, '3111234567'),
('Pedido Antonio - Membresía Gimnasio', 'Entregado', 35.00, 11, '3106789012'),
('Pedido Diana - Examen de Vista', 'En Proceso', 50.00, 12, '3112345678'),
('Pedido Manuel - Vacuna Veterinaria', 'Pendiente', 40.00, 13, '3107890123'),
('Pedido Elena - Lavado de Ropa', 'Entregado', 17.00, 14, '3113456789'),
('Pedido Javier - Limpieza en Seco', 'En Proceso', 24.00, 15, '3108901234'),
('Pedido Lucía - Pizza y Cerveza', 'Pendiente', 32.25, 16, '3114567890'),
('Pedido Miguel - Planta de Interior', 'Entregado', 30.00, 17, '3109012345'),
('Pedido Patricia - Pastel', 'En Proceso', 45.00, 18, '3115678901'),
('Pedido Rafael - Filete de Pescado', 'Pendiente', 20.50, 19, '3110123456'),
('Pedido Paula - Anillo', 'Entregado', 150.00, 20, '3116789012'),
('Pedido Francisco - Ramo de Rosas', 'En Proceso', 50.00, 21, '3111234567'),
('Pedido Alejandra - Auriculares', 'Pendiente', 91.98, 22, '3117890123'),
('Pedido Óscar - Ropa Deportiva', 'Entregado', 59.98, 23, '3112345678'),
('Pedido Isabel - Balón de Fútbol', 'En Proceso', 40.00, 24, '3118901234'),
('Pedido Julio - Tratamiento Facial', 'Pendiente', 70.00, 25, '3113456789'),
('Pedido Karen - Sofá', 'Entregado', 700.00, 26, '3119012345'),
('Pedido Ernesto - Alimento para Gatos', 'En Proceso', 25.00, 27, '3114567890'),
('Pedido Valeria - Audífonos', 'Pendiente', 160.00, 28, '3120123456'),
('Pedido Rodrigo - Electrónica', 'Entregado', 125.99, 29, '3115678901'),
('Pedido Camila - Varios', 'En Proceso', 95.50, 30, '3116789012');


INSERT INTO ProductosPedidos (num_pedido, id_producto) VALUES
(1, 1),   -- Pedido Juan - Pizza
(1, 17),  -- Pedido Juan - Pizza Mediana
(2, 2),   -- Pedido María - Arroz
(2, 4),   -- Pedido María - Café
(3, 3),   -- Pedido Carlos - Paracetamol
(4, 5),   -- Pedido Ana - Pan
(4, 4),   -- Pedido Ana - Café
(5, 6),   -- Pedido José - Pollo
(5, 5),   -- Pedido José - Pan
(6, 7),   -- Pedido Laura - Helado
(7, 8),   -- Pedido Pedro - Libro
(8, 9),   -- Pedido Sofía - Martillo
(9, 10),  -- Pedido David - Zapatos
(10, 11), -- Pedido Mónica - Corte de Cabello
(11, 12), -- Pedido Antonio - Membresía Gimnasio
(12, 13), -- Pedido Diana - Examen de Vista
(13, 14), -- Pedido Manuel - Vacuna
(14, 15), -- Pedido Elena - Lavado de Ropa
(15, 16), -- Pedido Javier - Limpieza en Seco
(16, 1),  -- Pedido Lucía - Pizza
(16, 18), -- Pedido Lucía - Cerveza
(17, 19), -- Pedido Miguel - Planta
(18, 20), -- Pedido Patricia - Pastel
(19, 21), -- Pedido Rafael - Pescado
(20, 22), -- Pedido Paula - Anillo
(21, 23), -- Pedido Francisco - Rosas
(22, 24), -- Pedido Alejandra - Auriculares
(23, 25), -- Pedido Óscar - Camiseta
(24, 26), -- Pedido Isabel - Balón
(25, 27), -- Pedido Julio - Tratamiento
(26, 28), -- Pedido Karen - Sofá
(27, 29), -- Pedido Ernesto - Alimento gatos
(28, 30), -- Pedido Valeria - Audífonos
(29, 24), -- Pedido Rodrigo - Electrónica
(30, 4);  -- Pedido Camila - Café


INSERT INTO PedidosCliente (num_pedido, cedula_cliente) VALUES
(1, 201),   -- Juan
(2, 202),   -- María
(3, 203),   -- Carlos
(4, 204),   -- Ana
(5, 205),   -- José
(6, 206),   -- Laura
(7, 207),   -- Pedro
(8, 208),   -- Sofía
(9, 209),   -- David
(10, 210),  -- Mónica
(11, 211),  -- Antonio
(12, 212),  -- Diana
(13, 213),  -- Manuel
(14, 214),  -- Elena
(15, 215),  -- Javier
(16, 216),  -- Lucía
(17, 217),  -- Miguel
(18, 218),  -- Patricia
(19, 219),  -- Rafael
(20, 220),  -- Paula
(21, 221),  -- Francisco
(22, 222),  -- Alejandra
(23, 223),  -- Óscar
(24, 224),  -- Isabel
(25, 225),  -- Julio
(26, 226),  -- Karen
(27, 227),  -- Ernesto
(28, 228),  -- Valeria
(29, 229),  -- Rodrigo
(30, 230);  -- Camila




INSERT INTO ProductosComercio (cedula_comercio, id_producto) VALUES
('3101234567', 1), ('3101234567', 2), ('3101234567', 3), 
('3107654321', 4), ('3107654321', 5), ('3107654321', 6),
('3102345678', 7), ('3102345678', 8), ('3102345678', 9),
('3108765432', 10), ('3108765432', 11), ('3108765432', 12),
('3103456789', 13), ('3103456789', 14), ('3103456789', 15),
('3109876543', 16), ('3109876543', 17), ('3109876543', 18),
('3104567890', 19), ('3104567890', 20), ('3104567890', 21),
('3110987654', 22), ('3110987654', 23), ('3110987654', 24),
('3105678901', 25), ('3105678901', 26), ('3105678901', 27),
('3111234567', 28), ('3111234567', 29), ('3111234567', 30);


INSERT INTO TarjetaCredito (numero_tarjeta, cedula_cliente, fecha_vencimiento, cvv) VALUES
(1234567890123456, 201, '2025-12-31', 123),
(2345678901234567, 202, '2024-11-30', 456),
(3456789012345678, 203, '2026-01-15', 789),
(4567890123456789, 204, '2025-07-20', 234),
(5678901234567890, 205, '2024-09-18', 567),
(6789012345678901, 206, '2026-02-10', 890),
(7890123456789012, 207, '2025-03-30', 345),
(8901234567890123, 208, '2024-05-25', 678),
(9012345678901234, 209, '2026-06-15', 901),
(1122334455667788, 210, '2025-08-05', 112),
(2233445566778899, 211, '2024-10-22', 334),
(3344556677889900, 212, '2026-04-30', 556),
(4455667788990011, 213, '2025-12-01', 778),
(5566778899001122, 214, '2024-02-11', 990),
(6677889900112233, 215, '2026-03-25', 113),
(7788990011223344, 216, '2025-06-18', 335),
(8899001122334455, 217, '2024-08-09', 557),
(9900112233445566, 218, '2026-09-12', 779),
(1011121314151617, 219, '2025-05-08', 991),
(1213141516171819, 220, '2024-12-21', 114),
(1314151617181920, 221, '2026-07-01', 336),
(1415161718192021, 222, '2025-04-14', 558),
(1516171819202122, 223, '2024-06-29', 770),
(1617181920212223, 224, '2026-08-03', 992),
(1718192021222324, 225, '2025-02-19', 115),
(1819202122232425, 226, '2024-11-11', 337),
(1920212223242526, 227, '2026-10-23', 559),
(2021222324252627, 228, '2025-01-30', 771),
(2122232425262728, 229, '2024-07-15', 993),
(2223242526272829, 230, '2026-12-05', 116);


INSERT INTO TelefonoAdmin (cedula_admin, telefono) VALUES
(101, '888123456'), (101, '888654321'),
(102, '888234567'), (102, '888765432'),
(103, '888345678'), (103, '888876543'),
(104, '888456789'), (104, '888987654'),
(105, '888567890'), (105, '888098765'),
(106, '888678901'), (106, '888109876'),
(107, '888789012'), (107, '888210987'),
(108, '888890123'), (108, '888321098'),
(109, '888901234'), (109, '888432109'),
(110, '888012345'), (110, '888543210'),
(111, '888123456'), (111, '888654321'),
(112, '888234567'), (112, '888765432'),
(113, '888345678'), (113, '888876543'),
(114, '888456789'), (114, '888987654'),
(115, '888567890'), (115, '888098765'),
(116, '888678901'), (116, '888109876'),
(117, '888789012'), (117, '888210987'),
(118, '888890123'), (118, '888321098'),
(119, '888901234'), (119, '888432109'),
(120, '888012345'), (120, '888543210'),
(121, '888123456'), (121, '888654321'),
(122, '888234567'), (122, '888765432'),
(123, '888345678'), (123, '888876543'),
(124, '888456789'), (124, '888987654'),
(125, '888567890'), (125, '888098765'),
(126, '888678901'), (126, '888109876'),
(127, '888789012'), (127, '888210987'),
(128, '888890123'), (128, '888321098'),
(129, '888901234'), (129, '888432109'),
(130, '888012345'), (130, '888543210');



INSERT INTO TelefonoRepartidor (cedula_repartidor, telefono) VALUES
(1, '889123456'), (1, '889654321'),
(2, '889234567'), (2, '889765432'),
(3, '889345678'), (3, '889876543'),
(4, '889456789'), (4, '889987654'),
(5, '889567890'), (5, '889098765'),
(6, '889678901'), (6, '889109876'),
(7, '889789012'), (7, '889210987'),
(8, '889890123'), (8, '889321098'),
(9, '889901234'), (9, '889432109'),
(10, '889012345'), (10, '889543210'),
(11, '889123456'), (11, '889654321'),
(12, '889234567'), (12, '889765432'),
(13, '889345678'), (13, '889876543'),
(14, '889456789'), (14, '889987654'),
(15, '889567890'), (15, '889098765'),
(16, '889678901'), (16, '889109876'),
(17, '889789012'), (17, '889210987'),
(18, '889890123'), (18, '889321098');

INSERT INTO TelefonoCliente (cedula_cliente, telefono) VALUES
(201, '865012345'), (201, '865067890'),
(202, '865112345'), (202, '865167890'),
(203, '865212345'), (203, '865267890'),
(204, '865312345'), (204, '865367890'),
(205, '865412345'), (205, '865467890'),
(206, '865512345'), (206, '865567890'),
(207, '865612345'), (207, '865667890'),
(208, '865712345'), (208, '865767890'),
(209, '865812345'), (209, '865867890'),
(210, '865912345'), (210, '865967890'),
(211, '866012345'), (211, '866067890'),
(212, '866112345'), (212, '866167890'),
(213, '866212345'), (213, '866267890'),
(214, '866312345'), (214, '866367890'),
(215, '866412345'), (215, '866467890'),
(216, '866512345'), (216, '866567890'),
(217, '866612345'), (217, '866667890'),
(218, '866712345'), (218, '866767890'),
(219, '866812345'), (219, '866867890'),
(220, '866912345'), (220, '866967890'),
(221, '867012345'), (221, '867067890'),
(222, '867112345'), (222, '867167890'),
(223, '867212345'), (223, '867267890'),
(224, '867312345'), (224, '867367890'),
(225, '867412345'), (225, '867467890'),
(226, '867512345'), (226, '867567890'),
(227, '867612345'), (227, '867667890'),
(228, '867712345'), (228, '867767890'),
(229, '867812345'), (229, '867867890'),
(230, '867912345'), (230, '867967890');



INSERT INTO TelefonoComercio (cedula_comercio, telefono) VALUES
('3101234567', '600123456'), ('3101234567', '601123456'),
('3107654321', '600765432'), ('3107654321', '601765432'),
('3102345678', '600234567'), ('3102345678', '601234567'),
('3108765432', '600876543'), ('3108765432', '601876543'),
('3103456789', '600345678'), ('3103456789', '601345678'),
('3109876543', '600987654'), ('3109876543', '601987654'),
('3104567890', '600456789'), ('3104567890', '601456789'),
('3110987654', '601098765'), ('3110987654', '602098765'),
('3105678901', '600567890'), ('3105678901', '601567890'),
('3111234567', '601123456'), ('3111234567', '602123456'),
('3106789012', '600678901'), ('3106789012', '601678901'),
('3112345678', '601234567'), ('3112345678', '602234567'),
('3107890123', '600789012'), ('3107890123', '601789012'),
('3113456789', '601345678'), ('3113456789', '602345678'),
('3108901234', '600890123'), ('3108901234', '601890123'),
('3114567890', '601456789'), ('3114567890', '602456789'),
('3109012345', '600901234'), ('3109012345', '601901234'),
('3115678901', '601567890'), ('3115678901', '602567890'),
('3110123456', '601012345'), ('3110123456', '602012345'),
('3116789012', '601678901'), ('3116789012', '602678901'),
('3111234567', '601123457'), ('3111234567', '602123457'),
('3117890123', '601789012'), ('3117890123', '602789012'),
('3112345678', '601234568'), ('3112345678', '602234568'),
('3118901234', '601890123'), ('3118901234', '602890123'),
('3113456789', '601345679'), ('3113456789', '602345679'),
('3119012345', '601901234'), ('3119012345', '602901234'),
('3114567890', '601456790'), ('3114567890', '602456790'),
('3120123456', '602012345'), ('3120123456', '603012345'),
('3115678901', '601567891'), ('3115678901', '602567891');

INSERT INTO DireccionComercio (id_comercio, provincia, canton, distrito) VALUES
('3101234567', 'San José', 'Central', 'Carmen'),
('3107654321', 'San José', 'Desamparados', 'San Rafael Abajo'),
('3102345678', 'Alajuela', 'Central', 'San José'),
('3108765432', 'Alajuela', 'San Ramón', 'San Juan'),
('3103456789', 'Cartago', 'Central', 'Dulce Nombre'),
('3109876543', 'Cartago', 'Turrialba', 'Pavones'),
('3104567890', 'Heredia', 'Central', 'Mercedes'),
('3110987654', 'Heredia', 'San Isidro', 'San Isidro'),
('3105678901', 'Guanacaste', 'Liberia', 'Cañas Dulces'),
('3111234567', 'Guanacaste', 'Nicoya', 'Sámara'),
('3106789012', 'Puntarenas', 'Central', 'Barranca'),
('3112345678', 'Puntarenas', 'Esparza', 'San Juan Grande'),
('3107890123', 'Limón', 'Central', 'Cieneguita'),
('3113456789', 'Limón', 'Guácimo', 'Río Jiménez'),
('3108901234', 'San José', 'Escazú', 'San Rafael'),
('3114567890', 'San José', 'Santa Ana', 'Uruca'),
('3109012345', 'Alajuela', 'Atenas', 'Jesús'),
('3115678901', 'Cartago', 'Paraíso', 'Orosi'),
('3110123456', 'Heredia', 'Santo Domingo', 'Santa Rosa'),
('3116789012', 'Guanacaste', 'Santa Cruz', 'Tamarindo'),
('3111234567', 'San José', 'Puriscal', 'Candelarita'),
('3117890123', 'Limón', 'Pococí', 'Guápiles'),
('3112345678', 'Puntarenas', 'Buenos Aires', 'Brunka'),
('3118901234', 'Cartago', 'Jiménez', 'Juan Viñas'),
('3113456789', 'San José', 'Moravia', 'San Vicente'),
('3119012345', 'Alajuela', 'Upala', 'Bijagua'),
('3114567890', 'Puntarenas', 'Corredores', 'La Cuesta'),
('3120123456', 'Heredia', 'Belén', 'La Ribera'),
('3115678901', 'San José', 'Tibás', 'Cinco Esquinas');


INSERT INTO DireccionAdministrador (id_admin, provincia, canton, distrito) VALUES
(101, 'San José', 'Central', 'Carmen'),
(102, 'San José', 'Alajuelita', 'San Antonio'),
(103, 'Alajuela', 'Central', 'San José'),
(104, 'Cartago', 'Central', 'Carmen'),
(105, 'Cartago', 'La Unión', 'San Rafael'),
(106, 'Heredia', 'Central', 'Mercedes'),
(107, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(108, 'Guanacaste', 'Liberia', 'Cañas Dulces'),
(109, 'Guanacaste', 'Nicoya', 'Sámara'),
(110, 'Puntarenas', 'Central', 'Barranca'),
(111, 'Puntarenas', 'Esparza', 'San Juan Grande'),
(112, 'Limón', 'Central', 'Cieneguita'),
(113, 'Limón', 'Guácimo', 'Río Jiménez'),
(114, 'San José', 'Escazú', 'San Rafael'),
(115, 'San José', 'Santa Ana', 'Uruca'),
(116, 'Alajuela', 'Atenas', 'Jesús'),
(117, 'Cartago', 'Paraíso', 'Orosi'),
(118, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(119, 'Guanacaste', 'Santa Cruz', 'Tamarindo'),
(120, 'San José', 'Puriscal', 'Candelarita'),
(121, 'San José', 'Moravia', 'San Vicente'),
(122, 'Alajuela', 'Upala', 'Bijagua'),
(123, 'Puntarenas', 'Buenos Aires', 'Brunka'),
(124, 'Cartago', 'Jiménez', 'Juan Viñas'),
(125, 'San José', 'Tibás', 'Cinco Esquinas'),
(126, 'Puntarenas', 'Corredores', 'La Cuesta'),
(127, 'Heredia', 'Belén', 'La Ribera'),
(128, 'San José', 'Tibás', 'San Juan'),
(129, 'Alajuela', 'San Ramón', 'San Juan');


INSERT INTO DireccionPedido (id_pedido, provincia, canton, distrito) VALUES
(1, 'San José', 'Central', 'Carmen'),
(2, 'Alajuela', 'Atenas', 'Jesús'),
(3, 'Cartago', 'La Unión', 'San Rafael'),
(4, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(5, 'Guanacaste', 'Liberia', 'Cañas Dulces'),
(6, 'Puntarenas', 'Central', 'Barranca'),
(7, 'Limón', 'Central', 'Cieneguita'),
(8, 'San José', 'Escazú', 'San Rafael'),
(9, 'Alajuela', 'Upala', 'Bijagua'),
(10, 'Heredia', 'Belén', 'La Ribera'),
(11, 'Puntarenas', 'Esparza', 'San Juan Grande'),
(12, 'Cartago', 'Paraíso', 'Orosi'),
(13, 'San José', 'Puriscal', 'Candelarita'),
(14, 'San José', 'Moravia', 'San Vicente'),
(15, 'Guanacaste', 'Santa Cruz', 'Tamarindo'),
(16, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(17, 'Puntarenas', 'Corredores', 'La Cuesta'),
(18, 'Alajuela', 'San Ramón', 'San Juan'),
(19, 'San José', 'Tibás', 'Cinco Esquinas'),
(20, 'San José', 'Central', 'Carmen'),
(21, 'Cartago', 'Jiménez', 'Juan Viñas'),
(22, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(23, 'Alajuela', 'Atenas', 'Jesús'),
(24, 'Guanacaste', 'Liberia', 'Cañas Dulces'),
(25, 'Puntarenas', 'Central', 'Barranca'),
(26, 'Limón', 'Guácimo', 'Río Jiménez'),
(27, 'San José', 'Escazú', 'San Rafael'),
(28, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(29, 'Alajuela', 'San Ramón', 'San Juan'),
(30, 'Cartago', 'La Unión', 'San Rafael');


INSERT INTO DireccionRepartidor (id_repartidor, provincia, canton, distrito) VALUES
(1, 'San José', 'Central', 'Carmen'),
(2, 'Alajuela', 'Atenas', 'Jesús'),
(3, 'Cartago', 'La Unión', 'San Rafael'),
(4, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(5, 'Guanacaste', 'Liberia', 'Cañas Dulces'),
(6, 'Puntarenas', 'Central', 'Barranca'),
(7, 'Limón', 'Central', 'Cieneguita'),
(8, 'San José', 'Escazú', 'San Rafael'),
(9, 'Alajuela', 'Upala', 'Bijagua'),
(10, 'Heredia', 'Belén', 'La Ribera'),
(11, 'San José', 'Goicoechea', 'San Francisco'),
(12, 'Alajuela', 'San Ramón', 'San Isidro'),
(13, 'Cartago', 'Turrialba', 'La Suiza'),
(14, 'Heredia', 'San Isidro', 'San José'),
(15, 'Guanacaste', 'Nicoya', 'San Antonio'),
(16, 'Puntarenas', 'Coto Brus', 'Rivas'),
(17, 'Limón', 'Pococí', 'La Rita'),
(18, 'San José', 'Alajuelita', 'San Josecito'),

INSERT INTO DireccionCliente (id_cliente, provincia, canton, distrito) VALUES
(201, 'San José', 'Central', 'Carmen'),
(202, 'Alajuela', 'Atenas', 'San José'),
(203, 'Cartago', 'Turrialba', 'La Suiza'),
(204, 'Heredia', 'San Isidro', 'San José'),
(205, 'Guanacaste', 'Liberia', 'Cañas Dulces'),
(206, 'Puntarenas', 'Central', 'Barranca'),
(207, 'Limón', 'Central', 'Cieneguita'),
(208, 'San José', 'Escazú', 'San Rafael'),
(209, 'Alajuela', 'San Ramón', 'San Isidro'),
(210, 'Heredia', 'Barva', 'San José'),
(211, 'San José', 'Goicoechea', 'San Francisco'),
(212, 'Alajuela', 'La Fortuna', 'Muelle'),
(213, 'Cartago', 'La Unión', 'San Rafael'),
(214, 'Heredia', 'Santo Domingo', 'Santa Rosa'),
(215, 'Guanacaste', 'Santa Cruz', 'Diriá'),
(216, 'Puntarenas', 'Coto Brus', 'Rivas'),
(217, 'Limón', 'Pococí', 'La Rita'),
(218, 'San José', 'Alajuelita', 'San Josecito'),
(219, 'Alajuela', 'Atenas', 'Salitrillos'),
(220, 'Heredia', 'Flores', 'Santo Domingo'),
(221, 'Guanacaste', 'Liberia', 'La Garita'),
(222, 'Puntarenas', 'Quepos', 'Manuel Antonio'),
(223, 'Limón', 'Siquirres', 'La Dita'),
(224, 'San José', 'Desamparados', 'San Juan'),
(225, 'Alajuela', 'Upala', 'Bijagua'),
(226, 'Heredia', 'Belén', 'La Ribera'),
(227, 'Guanacaste', 'Nicoya', 'San Antonio'),
(228, 'Puntarenas', 'Puntarenas', 'El Roble'),
(229, 'Limón', 'Matina', 'Batán'),
(230, 'San José', 'Moravia', 'La Trinidad');

INSERT INTO ValidacionComercio (cedula_comercio, cedula_admin, estado) VALUES
('3101234567', 101, 'Aprobado'),
('3107654321', 102, 'Pendiente'),
('3102345678', 103, 'Rechazado'),
('3108765432', 104, 'Aprobado'),
('3103456789', 105, 'Pendiente'),
('3109876543', 106, 'Aprobado'),
('3104567890', 107, 'Rechazado'),
('3110987654', 108, 'Aprobado'),
('3105678901', 109, 'Pendiente'),
('3111234567', 110, 'Aprobado'),
('3106789012', 111, 'Rechazado'),
('3112345678', 112, 'Pendiente'),
('3107890123', 113, 'Aprobado'),
('3113456789', 114, 'Rechazado'),
('3108901234', 115, 'Pendiente'),
('3114567890', 116, 'Aprobado'),
('3109012345', 117, 'Rechazado'),
('3115678901', 118, 'Aprobado'),
('3110123456', 119, 'Pendiente'),
('3116789012', 120, 'Aprobado'),
('3111234567', 121, 'Rechazado'),
('3117890123', 122, 'Pendiente'),
('3112345678', 123, 'Aprobado'),
('3118901234', 124, 'Rechazado'),
('3113456789', 125, 'Pendiente'),
('3119012345', 126, 'Aprobado'),
('3120123456', 127, 'Rechazado'),
('3115678901', 128, 'Pendiente'),
('3116789012', 129, 'Aprobado');


