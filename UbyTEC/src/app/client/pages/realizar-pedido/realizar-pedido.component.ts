import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { TarjetaCredito, Pedido, ProductosPedidos } from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';

interface TotalesPedido {
  subtotal: number;
  iva: number;
  comisionServicio: number;
  total: number;
}

interface PedidosClienteSQL {
  num_Pedido: number;
  cedula_Cliente: number;
}

@Component({
  selector: 'app-realizar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderClientComponent,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.css']
})
export class RealizarPedidoComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';

  tarjetaForm: FormGroup;
  totales: TotalesPedido | null = null;
  cargando = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.tarjetaForm = this.formBuilder.group({
      numero_Tarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fecha_Vencimiento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  ngOnInit(): void {
    this.inicializarComponente();
  }

  private async inicializarComponente(): Promise<void> {
    try {
      this.cargando = true;
      this.recuperarTotales();
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private recuperarTotales(): void {
    let totalesString = sessionStorage.getItem('totales_pedido');
    if (totalesString) {
      this.totales = JSON.parse(totalesString);
    } else {
      this.router.navigate(['/administrar-carrito']);
    }
  }

  async procesarPago(): Promise<void> {
    if (this.tarjetaForm.invalid) {
      this.mostrarError('Por favor complete todos los campos correctamente');
      return;
    }

    try {
      let userDataStr = localStorage.getItem('loggedInUser');
      if (!userDataStr) {
        throw new Error('No se encontró información del usuario');
      }

      let userData = JSON.parse(userDataStr);
      console.log("Datos del usuario:", userData);
      this.cargando = true;

      // Procesar la tarjeta de crédito
      let formValues = this.tarjetaForm.value;
      let [month, year] = formValues.fecha_Vencimiento.split('/');
      let fecha = new Date(2000 + parseInt(year), parseInt(month) - 1);
      let fechaFormatted = fecha.toISOString().split('T')[0];

      let tarjetaData: TarjetaCredito = {
        numero_Tarjeta: formValues.numero_Tarjeta,
        fecha_Vencimiento: fechaFormatted,
        cvv: formValues.cvv,
        cedula_Cliente: userData.cedula
      };

      console.log("Enviando datos de tarjeta:", tarjetaData);

      // Procesar tarjeta
      await this.http.post(`${this.apiUrl}TarjetaCredito`, tarjetaData).toPromise();

      // Verificar comercio
      let comercioId = sessionStorage.getItem('comercio_id');
      if (!comercioId) {
        throw new Error('No se encontró el ID del comercio');
      }

      try {
        await this.http.get(`${this.apiUrl}ComercioAfiliado/${comercioId}`).toPromise();
      } catch (error) {
        throw new Error(`El comercio con ID ${comercioId} no existe`);
      }

      // Obtener siguiente número de pedido
      let pedidosResponse = await this.http.get<Pedido[]>(`${this.apiUrl}Pedido`).toPromise();
      let ultimoNumPedido = pedidosResponse ? Math.max(...pedidosResponse.map(p => p.num_Pedido), 0) : 0;
      let siguienteNumPedido = ultimoNumPedido + 1;

      // Crear pedido
      let pedido: Pedido = {
        num_Pedido: siguienteNumPedido,
        nombre: `Pedido ${siguienteNumPedido}`,
        estado: "Nuevo",
        monto_Total: this.totales?.total || 0,
        id_Repartidor: 1,
        cedula_Comercio: comercioId
      };

      // Validaciones
      if (!pedido.monto_Total || pedido.monto_Total <= 0) {
        throw new Error('El monto total debe ser mayor a 0');
      }

      if (!pedido.nombre || !pedido.cedula_Comercio) {
        throw new Error('Faltan campos requeridos en el pedido');
      }

      console.log("Enviando pedido:", JSON.stringify(pedido, null, 2));

      let response = await this.http.post<Pedido>(`${this.apiUrl}Pedido`, pedido).toPromise();

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log("Respuesta del servidor:", response);

      // Crear registro en PedidosClienteSQL
      let pedidosClienteSQL: PedidosClienteSQL = {
        num_Pedido: response.num_Pedido,
        cedula_Cliente: userData.cedula
      };

      console.log("Enviando registro a PedidosClienteSQL:", pedidosClienteSQL);

      await this.http.post(`${this.apiUrl}PedidosClienteControllerSQL`, pedidosClienteSQL).toPromise();

      // Procesar productos del pedido
      let cartItemsStr = localStorage.getItem('carrito');
      if (!cartItemsStr) {
        throw new Error('No hay items en el carrito');
      }

      let cartData = JSON.parse(cartItemsStr);
      let productos = cartData.productos;

      if (!Array.isArray(productos)) {
        throw new Error('Formato de carrito inválido');
      }

      let productosPedidos: ProductosPedidos[] = productos.map((item: any) => ({
        num_Pedido: response.num_Pedido,
        id_Producto: item.producto.id
      }));

      console.log("Productos a registrar:", productosPedidos);

      if (productosPedidos.length === 0) {
        throw new Error('No hay productos para registrar');
      }

      // Registrar productos
      for (let producto of productosPedidos) {
        await this.http.post(`${this.apiUrl}ProductosPedidos`, producto).toPromise();
      }

      // Guardar número de pedido y limpiar datos
      console.log('Guardando número de pedido:', response.num_Pedido);
      sessionStorage.setItem('pedido_actual', response.num_Pedido.toString());
      localStorage.removeItem('carrito');
      sessionStorage.removeItem('totales_pedido');

      // Mostrar confirmación
      await Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado con éxito!',
        text: 'Tu pedido ha sido procesado y está en camino',
        confirmButtonText: 'Aceptar'
      });

      this.router.navigate(['/recepcion-pedidos']);

    } catch (error) {
      console.error('Error completo:', error);
      if (error instanceof HttpErrorResponse) {
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        const errorMessage = error.error?.errors
          ? Object.values(error.error.errors).join('\n')
          : error.error?.message || 'Error al procesar el pedido';
        this.mostrarError(errorMessage);
      } else {
        this.manejarError(error);
      }
    } finally {
      this.cargando = false;
    }
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    let mensaje = 'Ha ocurrido un error inesperado';

    if (error instanceof HttpErrorResponse) {
      mensaje = error.error?.message || error.message || mensaje;
    } else if (error instanceof Error) {
      mensaje = error.message;
    }

    this.errorMessage = mensaje;
    this.mostrarError(mensaje);
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  volverAlCarrito(): void {
    this.router.navigate(['/entrar-comercios']);
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
