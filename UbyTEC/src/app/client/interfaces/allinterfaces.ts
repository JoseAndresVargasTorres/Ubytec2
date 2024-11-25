// Administrador.ts
export interface Administrador {
  cedula: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
}

// Cliente.ts
export interface Cliente {
  cedula: number;
  password: string;
  usuario:string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  fecha_Nacimiento: Date;
}

// ComercioAfiliado.ts
export interface ComercioAfiliado {
  cedula_Juridica: string;
  nombre: string;
  correo: string;
  sinpe: string;
  id_Tipo: number;
  cedula_Admin: number;
}

// DireccionAdministrador.ts
export interface DireccionAdministrador {
  id_Admin: number;
  provincia: string;
  canton: string;
  distrito: string;
}

// DireccionCliente.ts
export interface DireccionCliente {
  id_Cliente: number;
  provincia: string;
  canton: string;
  distrito: string;
}

// DireccionComercio.ts
export interface DireccionComercio {
  id_Comercio: string;
  provincia: string;
  canton: string;
  distrito: string;
}

// DireccionPedido.ts
export interface DireccionPedido {
  id_pedido: number;
  provincia: string;
  canton: string;
  distrito: string;
}

// DireccionRepartidor.ts
export interface DireccionRepartidor {
  id_Repartidor: number;
  provincia: string;
  canton: string;
  distrito: string;
}

// Pedido.ts
export interface Pedido {
  num_Pedido: number;
  nombre: string;
  estado: string;
  monto_Total: number;
  id_Repartidor: number;
  cedula_Comercio: string;
}

// PedidosCliente.ts
export interface PedidosCliente {
  id: string;
  numPedido: number;
  cedulaCliente: number;
  feedback: string;
}

// Producto.ts
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
}

// ProductoComercio.ts
export interface ProductoComercio {
  cedula_Comercio: string;
  id_Producto: number;
}

// ProductosPedidos.ts
export interface ProductosPedidos {
  num_Pedido: number;
  id_Producto: number;
}

// Repartidor.ts
export interface Repartidor {
  id: number;
  usuario: string;
  nombre: string;
  password: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  disponible?:string;
}

// TarjetaCredito.ts
export interface TarjetaCredito {
  numero_Tarjeta: number;
  cedula_Cliente: number;
  fecha_Vencimiento: string;
  cvv: number;
}

// TelefonoAdmin.ts
export interface TelefonoAdmin {
  cedula_Admin: number;
  telefono: string;
}

// TelefonoCliente.ts
export interface TelefonoCliente {
  cedula_Cliente: number;
  telefono: string;
}

// TelefonoComercio.ts
export interface TelefonoComercio {
  cedula_Comercio: string;
  telefono: string;
}

// TelefonoRepartidor.ts
export interface TelefonoRepartidor {
  cedula_Repartidor: number;
  telefono: string;
}

// TipoComercio.ts
export interface TipoComercio {
  id: number;
  nombre: string;
}

// ValidacionComercio.ts
export interface ValidacionComercio {
  cedulaComercio: string;
  comentario: string;
  estado: string;
}

// ValidacionComercioSQL.ts
export interface ValidacionComercioControllerSQL {
  cedula_Comercio: string;
  cedula_Admin: number;
  estado: string;
}

