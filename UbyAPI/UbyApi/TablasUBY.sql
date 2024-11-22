CREATE TABLE Administrador (
    cedula INT PRIMARY KEY,
    usuario NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(64) NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    apellido1 NVARCHAR(50) NOT NULL,
    apellido2 NVARCHAR(50)
);

CREATE TABLE TipoComercio (
    id INT PRIMARY KEY identity(1,1),
    nombre NVARCHAR(50) NOT NULL
);

CREATE TABLE ComercioAfiliado (
    cedula_juridica NVARCHAR(20) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    correo NVARCHAR(100) NOT NULL,
    SINPE NVARCHAR(50),
    id_tipo INT,
    cedula_admin INT,
    FOREIGN KEY (id_tipo) REFERENCES TipoComercio(id),
    FOREIGN KEY (cedula_admin) REFERENCES Administrador(cedula)
);

CREATE TABLE Producto (
    id INT PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(50),
    precio DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Repartidor (
    id INT PRIMARY KEY,
    password NVARCHAR(64) not null,
    usuario NVARCHAR(50) UNIQUE NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    apellido1 NVARCHAR(50) NOT NULL,
    apellido2 NVARCHAR(50),
    correo NVARCHAR(100) NOT NULL
);

CREATE TABLE Pedido (
    num_pedido INT PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    estado NVARCHAR(50),
    monto_total DECIMAL(10, 2) NOT NULL,
    id_repartidor INT,
    cedula_comercio NVARCHAR(20),
    FOREIGN KEY (id_repartidor) REFERENCES Repartidor(id),
    FOREIGN KEY (cedula_comercio) REFERENCES ComercioAfiliado(cedula_juridica)
);


CREATE TABLE Cliente (
    cedula INT PRIMARY KEY,
    password NVARCHAR(64) NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    usuario NVARCHAR(50) NOT NULL,
    apellido1 NVARCHAR(50) NOT NULL,
    apellido2 NVARCHAR(50),
    correo NVARCHAR(100) NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE ProductosPedidos (
    num_pedido INT,
    id_producto INT,
    PRIMARY KEY (num_pedido, id_producto),
    FOREIGN KEY (num_pedido) REFERENCES Pedido(num_pedido),
    FOREIGN KEY (id_producto) REFERENCES Producto(id)
);

CREATE TABLE PedidosCliente (
    num_pedido INT,
    cedula_cliente INT,
    PRIMARY KEY (num_pedido,cedula_cliente),
    FOREIGN KEY (num_pedido) REFERENCES Pedido(num_pedido),
    FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula)
);

CREATE TABLE ValidacionComercio (
    cedula_comercio NVARCHAR(20) PRIMARY KEY,
    cedula_admin INT,
    estado NVARCHAR(50),
    FOREIGN KEY (cedula_admin) REFERENCES Administrador(cedula),
    FOREIGN KEY (cedula_comercio) REFERENCES ComercioAfiliado(cedula_juridica)
);

CREATE TABLE ProductosComercio (
    cedula_comercio NVARCHAR(20),
    id_producto INT,
    PRIMARY KEY (cedula_comercio, id_producto),
    FOREIGN KEY (cedula_comercio) REFERENCES ComercioAfiliado(cedula_juridica),
    FOREIGN KEY (id_producto) REFERENCES Producto(id)
);

CREATE TABLE TarjetaCredito (
    numero_tarjeta BIGINT PRIMARY KEY,
    cedula_cliente INT,
    fecha_vencimiento DATE,
    cvv INT,
    FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula)
);

CREATE TABLE TelefonoAdmin (
    cedula_admin INT,
    telefono NVARCHAR(20),
    PRIMARY KEY (cedula_admin,telefono),
    FOREIGN KEY (cedula_admin) REFERENCES Administrador(cedula)
);

CREATE TABLE TelefonoRepartidor (
    cedula_repartidor INT ,
    telefono NVARCHAR(20),
    PRIMARY KEY (cedula_repartidor,telefono),
    FOREIGN KEY (cedula_repartidor) REFERENCES Repartidor(id)
);

CREATE TABLE TelefonoCliente (
    cedula_cliente INT,
    telefono NVARCHAR(20),
    PRIMARY KEY (cedula_cliente, telefono),
    FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula)
);

CREATE TABLE TelefonoComercio (
    cedula_comercio NVARCHAR(20),
    telefono NVARCHAR(20),
    PRIMARY KEY (cedula_comercio,telefono),
    FOREIGN KEY (cedula_comercio) REFERENCES ComercioAfiliado(cedula_juridica)
);

CREATE TABLE DireccionComercio (
    id_comercio NVARCHAR(20) PRIMARY KEY,
    provincia NVARCHAR(50),
    canton NVARCHAR(50),
    distrito NVARCHAR(50),
    FOREIGN KEY (id_comercio) REFERENCES ComercioAfiliado(cedula_juridica)
);

CREATE TABLE DireccionAdministrador (
    id_admin INT PRIMARY KEY,
    provincia NVARCHAR(50),
    canton NVARCHAR(50),
    distrito NVARCHAR(50),
    FOREIGN KEY (id_admin) REFERENCES Administrador(cedula)
);

CREATE TABLE DireccionPedido (
    id_pedido INT PRIMARY KEY,
    provincia NVARCHAR(50),
    canton NVARCHAR(50),
    distrito NVARCHAR(50),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(num_pedido)
);

CREATE TABLE DireccionRepartidor (
    id_repartidor INT PRIMARY KEY,
    provincia NVARCHAR(50),
    canton NVARCHAR(50),
    distrito NVARCHAR(50),
    FOREIGN KEY (id_repartidor) REFERENCES Repartidor(id)
);

CREATE TABLE DireccionCliente (
    id_cliente INT PRIMARY KEY,
    provincia NVARCHAR(50),
    canton NVARCHAR(50),
    distrito NVARCHAR(50),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(cedula)
);

