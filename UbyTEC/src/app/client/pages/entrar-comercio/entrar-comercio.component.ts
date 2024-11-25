import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ComercioAfiliado, Producto, DireccionComercio, ProductoComercio, TipoComercio } from '../../interfaces/allinterfaces';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import Swal from 'sweetalert2';
import { Tipo_Comercio } from '../../../admin/interfaces/tipocomercio/Tipo_Comercio';

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
  private tiposComercio: { [key: number]: string } = {};

  // Estados
  comercios: ComercioAfiliado[] = [];
  productosComercio: Producto[] = [];
  comercioSeleccionado: ComercioAfiliado | null = null;
  direccionComercio: DireccionComercio | null = null;
  productosCarrito: CarritoItem[] = [];

  // Estados de UI
  cargandoComercios = false;
  cargandoProductos = false;
  errorMessage: string | null = null;

  // Formulario de filtros
  filtroForm: FormGroup;
  busquedaProducto = '';

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
      await this.cargarTiposComercio();
      await this.cargarComerciosRegion();
      this.recuperarCarrito();
    } catch (error) {
      this.manejarError(error);
    }
  }

  private async cargarTiposComercio(): Promise<void> {
    try {
      const response = await this.http.get<TipoComercio[]>(
        `${this.apiUrl}TipoComercio`
      ).toPromise();

      if (response) {
        this.tiposComercio = response.reduce((acc, tipo) => {
          acc[tipo.id] = tipo.nombre;
          return acc;
        }, {} as { [key: number]: string });
      }
    } catch (error) {
      console.error('Error al cargar tipos de comercio:', error);
      this.manejarError(error);
    }
  }


  getTipoComercio(id: number): string {
    return this.tiposComercio[id] || 'Desconocido';
  }

  private async cargarComerciosRegion(): Promise<void> {
    this.cargandoComercios = true;
    try {
      let response = await this.http.get<ComercioAfiliado[]>(
        `${this.apiUrl}ComercioAfiliado`
      ).toPromise();
      this.comercios = response || [];

      let carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        let carrito: CarritoState = JSON.parse(carritoGuardado);
        const comercioEncontrado = this.comercios.find(c => c.cedula_Juridica === carrito.comercioId);
        if (comercioEncontrado) {
          this.cambiarComercio(comercioEncontrado);
        }
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargandoComercios = false;
    }
  }

  private async cargarProductosComercio(cedulaJuridica: string): Promise<void> {
    this.cargandoProductos = true;
    try {
      // Primero obtener los IDs de productos del comercio
      let productosComercio = await this.http.get<ProductoComercio[]>(
        `${this.apiUrl}ProductosComercio`
      ).toPromise();

      // Filtrar los productos que pertenecen a este comercio
      let productosDelComercio = productosComercio?.filter(
        pc => pc.cedula_Comercio === cedulaJuridica
      ) || [];

      // Obtener los detalles de cada producto
      let promesasProductos = productosDelComercio.map(pc =>
        this.http.get<Producto>(`${this.apiUrl}Producto/${pc.id_Producto}`).toPromise()
      );

      this.productosComercio = (await Promise.all(promesasProductos)).filter(p => p !== null) as Producto[];
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargandoProductos = false;
    }
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
    let item = this.productosCarrito.find(
      item => item.producto.id === productoId
    );

    if (item) {
      let nuevaCantidad = item.cantidad + cambio;

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

  private verificarEstadoComercio(): void {
    const comercioId = sessionStorage.getItem('comercio_id');
    if (!comercioId && this.comercioSeleccionado) {
      sessionStorage.setItem('comercio_id', this.comercioSeleccionado.cedula_Juridica);
    }
  }

  obtenerTotal(): number {
    return this.productosCarrito.reduce((total, item) =>
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  // Persistencia del carrito
  private guardarCarrito(): void {
    if (!this.comercioSeleccionado) return;

    let carritoState: CarritoState = {
      comercioId: this.comercioSeleccionado.cedula_Juridica,
      comercioNombre: this.comercioSeleccionado.nombre,
      productos: this.productosCarrito
    };

    localStorage.setItem('carrito', JSON.stringify(carritoState));
    sessionStorage.setItem('comercio_id', this.comercioSeleccionado.cedula_Juridica);
  }

  private recuperarCarrito(): void {
    try {
      let carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        let carrito: CarritoState = JSON.parse(carritoGuardado);
        if (carrito.comercioId === this.comercioSeleccionado?.cedula_Juridica) {
          this.productosCarrito = carrito.productos;
          sessionStorage.setItem('comercio_id', carrito.comercioId);
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
    sessionStorage.setItem('comercio_id', comercio.cedula_Juridica);
    this.cargarProductosComercio(comercio.cedula_Juridica);
  }

  // Métodos de filtrado
  filtrarProductos(): Producto[] {
    let productos = [...this.productosComercio];
    let filtros = this.filtroForm.value;

    if (this.busquedaProducto) {
      let busqueda = this.busquedaProducto.toLowerCase();
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
    let input = event.target as HTMLInputElement;
    this.busquedaProducto = input.value;
  }

  obtenerCategoriasUnicas(): string[] {
    return Array.from(new Set(this.productosComercio.map(p => p.categoria)));
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

 

  async guardarYNavegar(): Promise<void> {
    try {
      if (this.productosCarrito.length === 0) {
        this.mostrarError('El carrito está vacío');
        return;
      }

      if (this.comercioSeleccionado) {
        sessionStorage.setItem('comercio_id', this.comercioSeleccionado.cedula_Juridica);
      }
      this.guardarCarrito();
      await this.router.navigate(['/administrar-carrito']);
    } catch (error) {
      this.manejarError(error);
    }
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
