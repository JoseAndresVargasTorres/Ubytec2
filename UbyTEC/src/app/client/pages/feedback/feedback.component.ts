import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { PedidosCliente, Pedido, Repartidor, ComercioAfiliado } from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';

interface FeedbackData {
  id: string;
  numPedido: number;
  cedulaCliente: number;
  feedback: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderClientComponent,
    RouterModule
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5037/api/';
  private readonly MOCK_DELAY = 800;

  feedbackForm: FormGroup;
  pedidoActual: Pedido | null = null;
  repartidor: Repartidor | null = null;
  comercio: ComercioAfiliado | null = null;
  cargando = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  private readonly mockPedido: Pedido = {
    num_Pedido: 123456,
    nombre: "Pedido Express",
    estado: "Entregado",
    monto_Total: 25000,
    id_Repartidor: 1,
    cedula_Comercio: "3001123456"
  };

  private readonly mockRepartidor: Repartidor = {
    id: 1,
    usuario: "repartidor1",
    nombre: "Juan",
    password: "****",
    apellido1: "Pérez",
    apellido2: "Mora",
    correo: "juan.perez@email.com"
  };

  private readonly mockComercio: ComercioAfiliado = {
    cedula_Juridica: "3001123456",
    nombre: "Restaurante El Buen Sabor",
    correo: "buensabor@email.com",
    sinpe: "88776655",
    id_Tipo: 1,
    cedula_Admin: 123456789
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.feedbackForm = this.formBuilder.group({
      feedbackComercio: ['', [Validators.required, Validators.minLength(10)]],
      feedbackRepartidor: ['', [Validators.required, Validators.minLength(10)]],
      feedbackGeneral: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.inicializarComponente();
  }

  private async inicializarComponente(): Promise<void> {
    try {
      this.cargando = true;
      await this.inicializarModoData();
      await this.cargarDatosPedido();
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

  private async cargarDatosPedido(): Promise<void> {
    if (this.usarDatosPrueba) {
      await this.simularDelay();
      this.pedidoActual = this.mockPedido;
      this.repartidor = this.mockRepartidor;
      this.comercio = this.mockComercio;
    } else {
      try {
        const numPedido = sessionStorage.getItem('pedido_actual');
        if (numPedido) {
          const pedidoResponse = await this.http.get<Pedido>(
            `${this.apiUrl}Pedido/${numPedido}`
          ).toPromise();

          if (pedidoResponse) {
            this.pedidoActual = pedidoResponse;
            await Promise.all([
              this.cargarDatosRepartidor(pedidoResponse.id_Repartidor),
              this.cargarDatosComercio(pedidoResponse.cedula_Comercio)
            ]);
          }
        }
      } catch (error) {
        this.manejarError(error);
        this.pedidoActual = this.mockPedido;
        this.repartidor = this.mockRepartidor;
        this.comercio = this.mockComercio;
      }
    }
  }

  private async cargarDatosRepartidor(idRepartidor: number): Promise<void> {
    const response = await this.http.get<Repartidor>(
      `${this.apiUrl}Repartidor/${idRepartidor}`
    ).toPromise();
    this.repartidor = response || null;
  }

  private async cargarDatosComercio(cedulaComercio: string): Promise<void> {
    const response = await this.http.get<ComercioAfiliado>(
      `${this.apiUrl}ComercioAfiliado/${cedulaComercio}`
    ).toPromise();
    this.comercio = response || null;
  }

  async enviarFeedback(): Promise<void> {
    if (this.feedbackForm.invalid) {
      this.mostrarError('Por favor complete todos los campos correctamente');
      return;
    }

    try {
      this.cargando = true;

      const feedbackData: FeedbackData = {
        id: Date.now().toString(),
        numPedido: this.pedidoActual?.num_Pedido || 0,
        cedulaCliente: 123456789, // Obtener de sesión en implementación real
        feedback: JSON.stringify({
          comercio: this.feedbackForm.value.feedbackComercio,
          repartidor: this.feedbackForm.value.feedbackRepartidor,
          general: this.feedbackForm.value.feedbackGeneral
        })
      };

      if (!this.usarDatosPrueba) {
        await this.http.post(`${this.apiUrl}PedidosCliente`, feedbackData).toPromise();
      } else {
        await this.simularDelay();
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu feedback!',
        text: 'Tu opinión nos ayuda a mejorar',
        confirmButtonText: 'Aceptar'
      });

      this.router.navigate(['/']);
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
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

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
