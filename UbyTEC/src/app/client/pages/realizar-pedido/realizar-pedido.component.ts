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
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';
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
    try {
      const apiDisponible = await this.verificarDisponibilidadAPI();
      this.usarDatosPrueba = !apiDisponible;
    } catch (error) {
      this.manejarError(error);
      this.usarDatosPrueba = true;
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

  private recuperarTotales(): void {
    const totalesString = sessionStorage.getItem('totales_pedido');
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
      this.cargando = true;
      const tarjetaData: TarjetaCredito = {
        ...this.tarjetaForm.value,
        cedula_Cliente: 123456789 // Obtener de sesión en implementación real
      };

      if (!this.usarDatosPrueba) {
        // Guardar datos de tarjeta
        await this.http.post(`${this.apiUrl}TarjetaCredito`, tarjetaData).toPromise();

        // Crear pedido
        const pedido: Pedido = {
          num_Pedido: Date.now(), // La API debería generar esto
          nombre: "Pedido " + Date.now(),
          estado: "Nuevo",
          monto_Total: this.totales?.total || 0,
          id_Repartidor: 0, // Se asigna después
          cedula_Comercio: sessionStorage.getItem('comercio_id') || ''
        };

        await this.http.post(`${this.apiUrl}Pedido`, pedido).toPromise();
      } else {
        await this.simularDelay();
      }

      // Limpiar carrito y storage
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
    this.router.navigate(['/administrar-carrito']);
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
