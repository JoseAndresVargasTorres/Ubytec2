import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import {
  Pedido,
  Repartidor,
  PedidosCliente,
  DireccionPedido,
  DireccionRepartidor
} from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';

interface RecepcionPedidoRequest {
  numPedido: number;
  idRepartidor: number;
}

interface RecepcionPedidoResponse {
  mensaje: string;
  exito: boolean;
}

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

  pedidoActual: Pedido | null = null;
  repartidor: Repartidor | null = null;
  direccionPedido: DireccionPedido | null = null;
  direccionRepartidor: DireccionRepartidor | null = null;
  pedidoCliente: PedidosCliente | null = null;
  cargando = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosPedido();
  }

  private async cargarDatosPedido(): Promise<void> {
    try {
      this.cargando = true;
      const numPedido = sessionStorage.getItem('pedido_actual');

      if (!numPedido) {
        throw new Error('No se encontró el número de pedido');
      }

      // Cargar datos del pedido
      const pedidoResponse = await this.http.get<Pedido>(
        `${this.apiUrl}Pedido/${numPedido}`
      ).toPromise();

      if (pedidoResponse) {
        this.pedidoActual = pedidoResponse;
        await Promise.all([
          this.cargarDatosRepartidor(pedidoResponse.id_Repartidor),
          this.cargarDireccionPedido(pedidoResponse.num_Pedido),
          this.cargarPedidoCliente(pedidoResponse.num_Pedido)
        ]);
      } else {
        throw new Error('No se encontró el pedido');
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private async cargarDatosRepartidor(idRepartidor: number): Promise<void> {
    try {
      const [repartidorResponse, direccionResponse] = await Promise.all([
        this.http.get<Repartidor>(
          `${this.apiUrl}Repartidor/${idRepartidor}`
        ).toPromise(),
        this.http.get<DireccionRepartidor>(
          `${this.apiUrl}DireccionRepartidor/${idRepartidor}`
        ).toPromise()
      ]);

      this.repartidor = repartidorResponse || null;
      this.direccionRepartidor = direccionResponse || null;
    } catch (error) {
      console.error('Error al cargar datos del repartidor:', error);
    }
  }

  private async cargarDireccionPedido(numPedido: number): Promise<void> {
    try {
      const direccionResponse = await this.http.get<DireccionPedido>(
        `${this.apiUrl}DireccionPedido/${numPedido}`
      ).toPromise();
      this.direccionPedido = direccionResponse || null;
    } catch (error) {
      console.error('Error al cargar dirección del pedido:', error);
    }
  }

  private async cargarPedidoCliente(numPedido: number): Promise<void> {
    try {
      const pedidoClienteResponse = await this.http.get<PedidosCliente>(
        `${this.apiUrl}PedidosCliente/pedido/${numPedido}`
      ).toPromise();
      this.pedidoCliente = pedidoClienteResponse || null;
    } catch (error) {
      console.error('Error al cargar relación pedido-cliente:', error);
    }
  }

  async confirmarRecepcion(): Promise<void> {
    try {
      if (!this.pedidoActual || !this.repartidor) {
        throw new Error('No se encontraron los datos del pedido o repartidor');
      }

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

        const request: RecepcionPedidoRequest = {
          numPedido: this.pedidoActual.num_Pedido,
          idRepartidor: this.repartidor.id
        };

        const response = await this.http.post<RecepcionPedidoResponse>(
          `${this.apiUrl}RecepcionPedido/completar`,
          request
        ).toPromise();

        if (response && response.exito) {
          await Swal.fire({
            title: '¡Pedido completado!',
            text: response.mensaje || 'La recepción del pedido ha sido confirmada',
            icon: 'success'
          });

          this.router.navigate(['/']);
        } else {
          throw new Error(response?.mensaje || 'Error al completar el pedido');
        }
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    let mensaje = 'Ha ocurrido un error inesperado';

    if (error instanceof HttpErrorResponse) {
      mensaje = error.error?.mensaje || error.message || mensaje;
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

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
