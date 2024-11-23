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
  private readonly apiUrl = 'http://localhost:5037/api/';
  private readonly MOCK_DELAY = 800;

  tarjetaForm: FormGroup;
  totales: TotalesPedido | null = null;
  cargando = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  private readonly mockTarjeta: TarjetaCredito = {
    numero_Tarjeta: 4532789612345678,
    cedula_Cliente: 123456789,
    fecha_Vencimiento: "12/25",
    cvv: 123
  };

  get minDate(): string {
    let today = new Date();
    today.setMonth(today.getMonth() + 1); // Set minimum to next month
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }


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
      await this.inicializarModoData();
      this.recuperarTotales();

      if (this.usarDatosPrueba) {
        this.tarjetaForm.patchValue({
          numero_Tarjeta: this.mockTarjeta.numero_Tarjeta,
          fecha_Vencimiento: this.mockTarjeta.fecha_Vencimiento,
          cvv: this.mockTarjeta.cvv
        });
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private async inicializarModoData(): Promise<void> {

      this.usarDatosPrueba = false;
    }


  private verificarDisponibilidadAPI(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get(`${this.apiUrl}health-check`).subscribe({
        next: () => resolve(true),
        error: () => resolve(false)
      });
    });
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
      console.log("userDataStr", userDataStr);

      if (!userDataStr) {
        throw new Error('No se encontró información del usuario');
      }

      let userData = JSON.parse(userDataStr);
      console.log("User data ", userData);
      this.cargando = true;

      let cartItems = localStorage.getItem('carrito');
      if (!cartItems) {
        throw new Error('No hay items en el carrito');
      }

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

      console.log("Sending tarjetaData:", tarjetaData);

      if (!this.usarDatosPrueba) {
        await this.http.post(`${this.apiUrl}TarjetaCredito`, tarjetaData).toPromise();
        let comercioId = sessionStorage.getItem('comercio_id');

        // Validar que existe el comercio
        if (!comercioId) {
          throw new Error('No se encontró el ID del comercio');
        }

        // Verificar que el comercio existe antes de crear el pedido
        try {
          await this.http.get(`${this.apiUrl}ComercioAfiliado/${comercioId}`).toPromise();
        } catch (error) {
          throw new Error(`El comercio con ID ${comercioId} no existe`);
        }

        let pedidosResponse = await this.http.get<Pedido[]>(`${this.apiUrl}Pedido`).toPromise();
        let ultimoNumPedido = pedidosResponse ? Math.max(...pedidosResponse.map(p => p.num_Pedido), 0) : 0;
        let siguienteNumPedido = ultimoNumPedido + 1;

        let pedido: Pedido = {
          num_Pedido: siguienteNumPedido,
          nombre: `Pedido ${siguienteNumPedido}`,
          estado: "Nuevo",
          monto_Total: this.totales?.total || 0,
          id_Repartidor: 1,
          cedula_Comercio: comercioId
        };

        // Validaciones adicionales
        if (pedido.monto_Total <= 0) {
          throw new Error('El monto total debe ser mayor a 0');
        }

        console.log("Intentando crear pedido con datos:", pedido);

        let response = await this.http.post<Pedido>(`${this.apiUrl}Pedido`, pedido).toPromise();
        console.log("Respuesta del servidor:", response);

        if (response) {
          let cartItemsStr = localStorage.getItem('carrito');
          if (!cartItemsStr) {
            throw new Error('No hay items en el carrito');
          }
          let cartData = JSON.parse(cartItemsStr);
          console.log("Datos del carrito:", cartData);

          let productos = cartData.productos;

          if (!Array.isArray(productos)) {
            throw new Error('Formato de carrito inválido');
          }

          console.log("productos ", productos);
          let productosPedidos: ProductosPedidos[] = productos.map((item: any) => ({
            num_Pedido: response.num_Pedido,
            id_Producto: item.producto.id
          }));

          console.log("ProductosPedidos a enviar:", productosPedidos);

          if (productosPedidos.length > 0) {
            for (let i = 0; i < productosPedidos.length; i++) {
              await this.http.post(`${this.apiUrl}ProductosPedidos`, productosPedidos[i]).toPromise();
            }
          } else {
            throw new Error('No hay productos para registrar');
          }
        }
      } else {
        await this.simularDelay();
      }

      localStorage.removeItem('carrito');
      sessionStorage.removeItem('totales_pedido');

      await Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado con éxito!',
        text: 'Tu pedido ha sido procesado y está en camino',
        confirmButtonText: 'Aceptar'
      });

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error completo:', error);
      if (error instanceof HttpErrorResponse) {
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
      }
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
}

  private async simularDelay(): Promise<void> {
    if (this.usarDatosPrueba) {
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));
    }
  }

  toggleModoData(): void {
    this.usarDatosPrueba = !this.usarDatosPrueba;
    this.mostrarNotificacion(
      `Usando ${this.usarDatosPrueba ? 'datos de prueba' : 'datos de la API'}`,
      'info'
    );
    this.inicializarComponente();
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

  volverAlCarrito(): void {
    this.router.navigate(['/entrar-comercios']);
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
