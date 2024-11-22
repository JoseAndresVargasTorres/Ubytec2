import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ComercioAfiliado, Producto, DireccionComercio } from '../../interfaces/allinterfaces';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import Swal from 'sweetalert2';

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

interface CarritoState {
  comercioId: string;
  comercioNombre: string;
  productos: CarritoItem[];
}

@Component({
  selector: 'app-entrar-comercio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderClientComponent,
    RouterModule
  ],
  templateUrl: './entrar-comercio.component.html',
  styleUrls: ['./entrar-comercio.component.css']
})
export class EntrarComercioComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';
  private readonly MAX_CANTIDAD = 99;
  private readonly MIN_CANTIDAD = 1;

  // Estados
  comercios: ComercioAfiliado[] = [];
  productosComercio: Producto[] = [];
  comercioSeleccionado: ComercioAfiliado | null = null;
  direccionComercio: DireccionComercio | null = null;
  productosCarrito: CarritoItem[] = [];

  // Estados de UI
  cargandoComercios = false;
  cargandoProductos = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  // Formulario de filtros
  filtroForm: FormGroup;
  busquedaProducto = '';

  // Datos de prueba
  private readonly mockComercios: ComercioAfiliado[] = [
    {
      cedula_Juridica: "3001123456",
      nombre: "Restaurante El Buen Sabor",
      correo: "buensabor@email.com",
      sinpe: "88776655",
      id_Tipo: 1,
      cedula_Admin: 123456789
    },
    {
      cedula_Juridica: "3001789012",
      nombre: "Super Fresh Market",
      correo: "fresh@email.com",
      sinpe: "87654321",
      id_Tipo: 2,
      cedula_Admin: 987654321
    },
    {
      cedula_Juridica: "3001345678",
      nombre: "Farmacia Salud Total",
      correo: "salud@email.com",
      sinpe: "89012345",
      id_Tipo: 3,
      cedula_Admin: 456789123
    }
  ];

  private readonly mockProductosPorComercio: { [key: string]: Producto[] } = {
    "3001123456": [
      {
        id: 1,
        nombre: "Hamburguesa Clásica",
        categoria: "Hamburguesas",
        precio: 5500
      },
      {
        id: 2,
        nombre: "Pizza Margarita",
        categoria: "Pizzas",
        precio: 8900
      },
      {
        id: 3,
        nombre: "Ensalada César",
        categoria: "Ensaladas",
        precio: 4500
      }
    ],
    "3001789012": [
      {
        id: 4,
        nombre: "Leche 1L",
        categoria: "Lácteos",
        precio: 1200
      },
      {
        id: 5,
        nombre: "Pan Integral",
        categoria: "Panadería",
        precio: 1500
      },
      {
        id: 6,
        nombre: "Manzanas (kg)",
        categoria: "Frutas",
        precio: 2200
      }
    ],
    "3001345678": [
      {
        id: 7,
        nombre: "Paracetamol",
        categoria: "Medicamentos",
        precio: 2500
      },
      {
        id: 8,
        nombre: "Vitamina C",
        categoria: "Vitaminas",
        precio: 5000
      },
      {
        id: 9,
        nombre: "Alcohol en Gel",
        categoria: "Higiene",
        precio: 1800
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      categoria: [''],
      precioMinimo: [''],
      precioMaximo: ['']
    });
  }

  ngOnInit(): void {
    this.inicializarComponente();
  }

  private async inicializarComponente(): Promise<void> {
    try {
      await this.inicializarModoData();
      await this.cargarComerciosRegion();
      this.recuperarCarrito();
    } catch (error) {
      this.manejarError(error);
    }
  }

  // Inicialización y carga de datos
  private async inicializarModoData(): Promise<void> {
    try {
      const apiDisponible = await this.verificarDisponibilidadAPI();
      this.usarDatosPrueba = !apiDisponible;

      if (!apiDisponible) {
        console.log('API no disponible, usando datos de prueba');
      }
    } catch (error) {
      this.manejarError(error);
      this.usarDatosPrueba = true;
    }
  }

  private async cargarComerciosRegion(): Promise<void> {
    this.cargandoComercios = true;
    try {
      if (this.usarDatosPrueba) {
        await this.simularDelay();
        this.comercios = this.mockComercios;
      } else {
        const response = await this.http.get<ComercioAfiliado[]>(
          `${this.apiUrl}ComercioAfiliado`
        ).toPromise();
        this.comercios = response || [];
      }
    } catch (error) {
      this.manejarError(error);
      this.comercios = this.mockComercios; // Fallback a datos de prueba
    } finally {
      this.cargandoComercios = false;
    }
  }

  private async cargarProductosComercio(cedulaJuridica: string): Promise<void> {
    this.cargandoProductos = true;
    try {
      if (this.usarDatosPrueba) {
        await this.simularDelay(800);
        this.productosComercio = this.mockProductosPorComercio[cedulaJuridica] || [];
      } else {
        const response = await this.http.get<Producto[]>(
          `${this.apiUrl}ProductoComercio/${cedulaJuridica}`
        ).toPromise();
        this.productosComercio = response || [];
      }
    } catch (error) {
      this.manejarError(error);
      this.productosComercio = this.mockProductosPorComercio[cedulaJuridica] || [];
    } finally {
      this.cargandoProductos = false;
    }
  }

  private verificarDisponibilidadAPI(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get(`${this.apiUrl}health-check`).subscribe({
        next: () => resolve(true),
        error: () => resolve(false)
      });
    });
  }

  // Métodos del carrito
  agregarAlCarrito(producto: Producto): void {
    let productoEnCarrito = this.productosCarrito.find(
      item => item.producto.id === producto.id
    );

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad < this.MAX_CANTIDAD) {
        productoEnCarrito.cantidad++;
        this.mostrarNotificacion('Cantidad actualizada', 'success');
      } else {
        this.mostrarError(`La cantidad máxima permitida es ${this.MAX_CANTIDAD}`);
      }
    } else {
      this.productosCarrito.push({ producto, cantidad: 1 });
      this.mostrarNotificacion('Producto agregado al carrito', 'success');
    }

    this.guardarCarrito();
  }

  actualizarCantidad(productoId: number, cambio: number): void {
    const item = this.productosCarrito.find(
      item => item.producto.id === productoId
    );

    if (item) {
      const nuevaCantidad = item.cantidad + cambio;

      if (nuevaCantidad >= this.MIN_CANTIDAD && nuevaCantidad <= this.MAX_CANTIDAD) {
        item.cantidad = nuevaCantidad;
        this.guardarCarrito();
      } else if (nuevaCantidad < this.MIN_CANTIDAD) {
        this.eliminarDelCarrito(productoId);
      }
    }
  }

  eliminarDelCarrito(productoId: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Estás seguro de que deseas eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosCarrito = this.productosCarrito.filter(
          item => item.producto.id !== productoId
        );
        this.guardarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito', 'success');
      }
    });
  }

  limpiarCarrito(): void {
    if (this.productosCarrito.length === 0) return;

    Swal.fire({
      title: '¿Limpiar carrito?',
      text: '¿Estás seguro de que deseas eliminar todos los productos del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosCarrito = [];
        this.guardarCarrito();
        this.mostrarNotificacion('Carrito limpiado', 'success');
      }
    });
  }

  obtenerTotal(): number {
    return this.productosCarrito.reduce((total, item) =>
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  // Persistencia del carrito
  private guardarCarrito(): void {
    if (!this.comercioSeleccionado) return;

    const carritoState: CarritoState = {
      comercioId: this.comercioSeleccionado.cedula_Juridica,
      comercioNombre: this.comercioSeleccionado.nombre,
      productos: this.productosCarrito
    };

    localStorage.setItem('carrito', JSON.stringify(carritoState));
  }

  private recuperarCarrito(): void {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        const carrito: CarritoState = JSON.parse(carritoGuardado);
        if (carrito.comercioId === this.comercioSeleccionado?.cedula_Juridica) {
          this.productosCarrito = carrito.productos;
        }
      }
    } catch (error) {
      console.error('Error al recuperar el carrito:', error);
      this.limpiarCarrito();
    }
  }

  // Métodos de interacción
  seleccionarComercio(comercio: ComercioAfiliado): void {
    if (this.comercioSeleccionado?.cedula_Juridica !== comercio.cedula_Juridica) {
      if (this.productosCarrito.length > 0) {
        this.confirmarCambioComercio(comercio);
      } else {
        this.cambiarComercio(comercio);
      }
    }
  }

  private confirmarCambioComercio(nuevoComercio: ComercioAfiliado): void {
    Swal.fire({
      title: '¿Cambiar de comercio?',
      text: 'Si cambias de comercio, perderás los productos en tu carrito actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, mantener carrito'
    }).then((result) => {
      if (result.isConfirmed) {
        this.limpiarCarrito();
        this.cambiarComercio(nuevoComercio);
      }
    });
  }

  private cambiarComercio(comercio: ComercioAfiliado): void {
    this.comercioSeleccionado = comercio;
    this.cargarProductosComercio(comercio.cedula_Juridica);
  }

  // Métodos de filtrado
  filtrarProductos(): Producto[] {
    let productos = [...this.productosComercio];
    const filtros = this.filtroForm.value;

    if (this.busquedaProducto) {
      const busqueda = this.busquedaProducto.toLowerCase();
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.categoria.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.categoria) {
      productos = productos.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.precioMinimo) {
      productos = productos.filter(p => p.precio >= filtros.precioMinimo);
    }

    if (filtros.precioMaximo) {
      productos = productos.filter(p => p.precio <= filtros.precioMaximo);
    }

    return productos;
  }

  buscarProductos(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busquedaProducto = input.value;
  }

  obtenerCategoriasUnicas(): string[] {
    return Array.from(new Set(this.productosComercio.map(p => p.categoria)));
  }

  // Utilidades
  private async simularDelay(ms: number = 1000): Promise<void> {
    if (this.usarDatosPrueba) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    let mensaje = 'Ha ocurrido un error inesperado';

    if (error instanceof HttpErrorResponse) {
      mensaje = error.error?.message || error.message || mensaje;
    }

    this.errorMessage = mensaje;
    this.mostrarError(mensaje);
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    Swal.fire({
      text: mensaje,
      icon: tipo,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  // Helpers
  getTipoComercio(id: number): string {
    const tipos: { [key: number]: string } = {
      1: 'Restaurante',
      2: 'Supermercado',
      3: 'Farmacia',
      4: 'Dulcería'
    };
    return tipos[id] || 'Desconocido';
  }

  // Toggle modo de datos
  toggleModoData(): void {
    this.usarDatosPrueba = !this.usarDatosPrueba;
    this.cargarComerciosRegion();
    if (this.comercioSeleccionado) {
      this.cargarProductosComercio(this.comercioSeleccionado.cedula_Juridica);
    }

    this.mostrarNotificacion(
      `Usando ${this.usarDatosPrueba ? 'datos de prueba' : 'datos de la API'}`,
      'info'
    );
  }

  // Guardar en carrito y navegar
  async guardarYNavegar(): Promise<void> {
    try {
      if (this.productosCarrito.length === 0) {
        this.mostrarError('El carrito está vacío');
        return;
      }

      // Guardar estado actual del carrito
      this.guardarCarrito();

      // Navegar a la página de administrar carrito
      await this.router.navigate(['/administrar-carrito']);
    } catch (error) {
      this.manejarError(error);
    }
  }

  // Limpieza al destruir el componente
  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
