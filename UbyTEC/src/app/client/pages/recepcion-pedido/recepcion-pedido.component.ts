import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { Pedido, Repartidor } from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recepcion-pedido',
  standalone: true,
  imports: [
    CommonModule,
    HeaderClientComponent,
    RouterModule
  ],
  templateUrl: './recepcion-pedido.component.html',
  styleUrls: ['./recepcion-pedido.component.css']
})
export class RecepcionPedidoComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';
  private readonly MOCK_DELAY = 800;

  pedidoActual: Pedido | null = null;
  repartidor: Repartidor | null = null;
  cargando = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  private readonly mockPedido: Pedido = {
    num_Pedido: 123456,
    nombre: "Pedido Express",
    estado: "En camino",
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
    } else {
      try {
        const numPedido = sessionStorage.getItem('pedido_actual');
        if (numPedido) {
          const pedidoResponse = await this.http.get<Pedido>(
            `${this.apiUrl}Pedido/${numPedido}`
          ).toPromise();

          if (pedidoResponse) {
            this.pedidoActual = pedidoResponse;
            await this.cargarDatosRepartidor(pedidoResponse.id_Repartidor);
          }
        }
      } catch (error) {
        this.manejarError(error);
        this.pedidoActual = this.mockPedido;
        this.repartidor = this.mockRepartidor;
      }
    }
  }

  private async cargarDatosRepartidor(idRepartidor: number): Promise<void> {
    try {
      const repartidorResponse = await this.http.get<Repartidor>(
        `${this.apiUrl}Repartidor/${idRepartidor}`
      ).toPromise();
      this.repartidor = repartidorResponse || null;
    } catch (error) {
      this.manejarError(error);
    }
  }

  async confirmarRecepcion(): Promise<void> {
    try {
      const confirmacion = await Swal.fire({
        title: '¿Confirmar recepción del pedido?',
        text: 'Esta acción marcará el pedido como completado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmacion.isConfirmed) {
        this.cargando = true;

        if (!this.usarDatosPrueba && this.pedidoActual) {
          // Actualizar estado del pedido
          const pedidoActualizado: Pedido = {
            ...this.pedidoActual,
            estado: 'Finalizado'
          };

          await this.http.put(
            `${this.apiUrl}Pedido/${this.pedidoActual.num_Pedido}`,
            pedidoActualizado
          ).toPromise();

          // Marcar repartidor como disponible
          if (this.repartidor) {
            await this.http.put(
              `${this.apiUrl}Repartidor/${this.repartidor.id}`,
              { ...this.repartidor, disponible: true }
            ).toPromise();
          }
        } else {
          await this.simularDelay();
        }

        await Swal.fire({
          title: '¡Pedido completado!',
          text: 'La recepción del pedido ha sido confirmada',
          icon: 'success'
        });

        this.router.navigate(['/']);
      }
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
