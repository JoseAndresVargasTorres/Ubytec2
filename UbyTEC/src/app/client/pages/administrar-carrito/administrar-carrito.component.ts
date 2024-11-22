import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ComercioAfiliado, Producto, ProductosPedidos } from '../../interfaces/allinterfaces';
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
  total: number;
  iva: number;
  comisionServicio: number;
  totalFinal: number;
}

@Component({
  selector: 'app-administrar-carrito',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderClientComponent,
    RouterModule
  ],
  templateUrl: './administrar-carrito.component.html',
  styleUrls: ['./administrar-carrito.component.css']
})
export class AdministrarCarritoComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';
  private readonly MAX_CANTIDAD = 99;
  private readonly MIN_CANTIDAD = 1;
  private readonly MOCK_DELAY = 800;

  // Estados
  productosCarrito: CarritoItem[] = [];
  comercioId: string | null = null;
  comercioNombre: string | null = null;
  comercioSeleccionado: ComercioAfiliado | null = null;

  // Estados de UI
  cargando = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  // Datos de prueba
  private readonly mockComercio: ComercioAfiliado = {
    cedula_Juridica: "3001123456",
    nombre: "Restaurante El Buen Sabor",
    correo: "buensabor@email.com",
    sinpe: "88776655",
    id_Tipo: 1,
    cedula_Admin: 123456789
  };

  private readonly mockProductos: Producto[] = [
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
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarComponente();
  }

  private async inicializarComponente(): Promise<void> {
    try {
      this.cargando = true;
      await this.inicializarModoData();
      await this.recuperarCarrito();
      if (this.comercioId) {
        await this.cargarDatosComercio();
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
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

  private async cargarDatosComercio(): Promise<void> {
    if (!this.comercioId) return;

    try {
      if (this.usarDatosPrueba) {
        await this.simularDelay();
        this.comercioSeleccionado = this.mockComercio;
      } else {
        const response = await this.http.get<ComercioAfiliado>(
          `${this.apiUrl}ComercioAfiliado/${this.comercioId}`
        ).toPromise();
        this.comercioSeleccionado = response || null;
      }
    } catch (error) {
      this.manejarError(error);
      // Fallback a datos de prueba
      this.comercioSeleccionado = this.mockComercio;
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
  async actualizarCantidad(productoId: number, cambio: number): Promise<void> {
    try {
      const item = this.productosCarrito.find(item => item.producto.id === productoId);
      if (item) {
        const nuevaCantidad = item.cantidad + cambio;

        if (nuevaCantidad <= 0) {
          await this.eliminarProducto(productoId);
        } else if (nuevaCantidad <= this.MAX_CANTIDAD) {
          item.cantidad = nuevaCantidad;
          this.guardarCarrito();
          this.mostrarNotificacion('Cantidad actualizada', 'success');
        } else {
          this.mostrarError(`La cantidad máxima permitida es ${this.MAX_CANTIDAD}`);
        }
      }
    } catch (error) {
      this.manejarError(error);
    }
  }

  async eliminarProducto(productoId: number): Promise<void> {
    try {
      const resultado = await Swal.fire({
        title: '¿Eliminar producto?',
        text: '¿Estás seguro de que deseas eliminar este producto del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (resultado.isConfirmed) {
        this.productosCarrito = this.productosCarrito.filter(
          item => item.producto.id !== productoId
        );
        this.guardarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito', 'success');

        if (this.productosCarrito.length === 0) {
          this.router.navigate(['/entrar-comercios']);
        }
      }
    } catch (error) {
      this.manejarError(error);
    }
  }

  async limpiarCarrito(): Promise<void> {
    if (this.productosCarrito.length === 0) {
      this.mostrarNotificacion('El carrito ya está vacío', 'info');
      return;
    }

    try {
      const resultado = await Swal.fire({
        title: '¿Limpiar carrito?',
        text: '¿Estás seguro de que deseas eliminar todos los productos del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
      });

      if (resultado.isConfirmed) {
        this.productosCarrito = [];
        this.guardarCarrito();
        this.mostrarNotificacion('Carrito limpiado', 'success');
        this.router.navigate(['/entrar-comercios']);
      }
    } catch (error) {
      this.manejarError(error);
    }
  }

  // Cálculos monetarios
  calcularSubtotal(item: CarritoItem): number {
    return Math.round(item.producto.precio * item.cantidad);
  }

  calcularTotal(): number {
    return this.productosCarrito.reduce(
      (total, item) => total + this.calcularSubtotal(item),
      0
    );
  }

  calcularIVA(): number {
    return Math.round(this.calcularTotal() * 0.13); // 13% IVA
  }

  calcularComisionServicio(): number {
    return Math.round(this.calcularTotal() * 0.05); // 5% comisión
  }

  calcularTotalFinal(): number {
    return this.calcularTotal() + this.calcularIVA() + this.calcularComisionServicio();
  }

  // Persistencia del carrito
  private guardarCarrito(): void {
    try {
      const carritoState: CarritoState = {
        comercioId: this.comercioId!,
        comercioNombre: this.comercioNombre!,
        productos: this.productosCarrito,
        total: this.calcularTotal(),
        iva: this.calcularIVA(),
        comisionServicio: this.calcularComisionServicio(),
        totalFinal: this.calcularTotalFinal()
      };

      localStorage.setItem('carrito', JSON.stringify(carritoState));
    } catch (error) {
      this.manejarError(error);
    }
  }

  private async recuperarCarrito(): Promise<void> {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        const carrito: CarritoState = JSON.parse(carritoGuardado);
        this.comercioId = carrito.comercioId;
        this.comercioNombre = carrito.comercioNombre;
        this.productosCarrito = carrito.productos;
      } else {
        // Si no hay carrito guardado, redirigir a selección de comercio
        await this.router.navigate(['/entrar-comercios']);
      }
    } catch (error) {
      console.error('Error al recuperar el carrito:', error);
      this.limpiarCarrito();
    }
  }

  // Proceder al pago
  async procederPago(): Promise<void> {
    if (this.productosCarrito.length === 0) {
      this.mostrarError('No hay productos en el carrito');
      return;
    }

    try {
      this.cargando = true;

      const totales = {
        subtotal: this.calcularTotal(),
        iva: this.calcularIVA(),
        comisionServicio: this.calcularComisionServicio(),
        total: this.calcularTotalFinal()
      };

      // Guardar totales para la página de pago
      sessionStorage.setItem('totales_pedido', JSON.stringify(totales));

      if (!this.usarDatosPrueba) {
        const pedido: ProductosPedidos = {
          num_Pedido: Date.now(), // Temporal, la API debería generar esto
          id_Producto: this.productosCarrito[0].producto.id // Ajustar según la interfaz real
        };

        await this.http.post(`${this.apiUrl}ProductosPedidos`, pedido).toPromise();
      }

      await this.router.navigate(['/realizar-pedido']);
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  // Utilidades
  private async simularDelay(): Promise<void> {
    if (this.usarDatosPrueba) {
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));
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

  // Toggle modo de datos
  toggleModoData(): void {
    this.usarDatosPrueba = !this.usarDatosPrueba;
    this.mostrarNotificacion(
      `Usando ${this.usarDatosPrueba ? 'datos de prueba' : 'datos de la API'}`,
      'info'
    );
    this.inicializarComponente();
  }

  // Navegación
  volverAComercio(): void {
    this.router.navigate(['/entrar-comercios']);
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
