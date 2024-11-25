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
import { catchError, firstValueFrom, of } from 'rxjs';

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
  private readonly apiUrl = 'http://localhost:5037/api/';

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

      // Cargar datos del pedido con manejo de errores
      const pedidoResponse = await firstValueFrom(
        this.http.get<Pedido>(`${this.apiUrl}Pedido/${numPedido}`).pipe(
          catchError((error) => {
            console.error('Error al cargar pedido:', error);
            return of(null);
          })
        )
      );

      if (!pedidoResponse) {
        throw new Error('No se pudo cargar el pedido');
      }

      this.pedidoActual = pedidoResponse;

      // Cargar datos adicionales de manera independiente
      await Promise.allSettled([
        this.cargarDatosRepartidor(pedidoResponse.id_Repartidor),
        this.cargarDireccionPedido(pedidoResponse.num_Pedido),
        this.cargarPedidoCliente(pedidoResponse.num_Pedido)
      ]);

    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private async cargarDatosRepartidor(idRepartidor: number): Promise<void> {
    try {
      const [repartidorResponse, direccionResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<Repartidor>(`${this.apiUrl}Repartidor/${idRepartidor}`).pipe(
            catchError((error) => {
              console.error('Error al cargar repartidor:', error);
              return of(null);
            })
          )
        ),
        firstValueFrom(
          this.http.get<DireccionRepartidor>(`${this.apiUrl}DireccionRepartidor/${idRepartidor}`).pipe(
            catchError((error) => {
              console.error('Error al cargar dirección del repartidor:', error);
              return of(null);
            })
          )
        )
      ]);

      this.repartidor = repartidorResponse;
      this.direccionRepartidor = direccionResponse;
    } catch (error) {
      console.error('Error al cargar datos del repartidor:', error);
    }
  }

  private async cargarDireccionPedido(numPedido: number): Promise<void> {
    try {
      const direccionResponse = await firstValueFrom(
        this.http.get<DireccionPedido>(`${this.apiUrl}DireccionPedido/${numPedido}`).pipe(
          catchError((error) => {
            if (error.status === 404) {
              console.log('No se encontró dirección para el pedido:', numPedido);
            } else {
              console.error('Error al cargar dirección del pedido:', error);
            }
            return of(null);
          })
        )
      );
      this.direccionPedido = direccionResponse;
    } catch (error) {
      console.error('Error al cargar dirección del pedido:', error);
    }
  }

  private async cargarPedidoCliente(numPedido: number): Promise<void> {
    try {
      const pedidoClienteResponse = await firstValueFrom(
        this.http.get<PedidosCliente>(`${this.apiUrl}PedidosCliente/pedido/${numPedido}`).pipe(
          catchError((error) => {
            if (error.status === 404) {
              console.log('No se encontró relación pedido-cliente:', numPedido);
            } else {
              console.error('Error al cargar relación pedido-cliente:', error);
            }
            return of(null);
          })
        )
      );
      this.pedidoCliente = pedidoClienteResponse;
    } catch (error) {
      console.error('Error al cargar relación pedido-cliente:', error);
    }
  }

  async confirmarRecepcion(): Promise<void> {
    try {
      if (!this.pedidoActual || !this.repartidor) {
        throw new Error('No se encontraron los datos necesarios para confirmar la recepción');
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

        const response = await firstValueFrom(
          this.http.post<RecepcionPedidoResponse>(
            `${this.apiUrl}RecepcionPedido/completar`,
            request
          ).pipe(
            catchError((error) => {
              throw new Error(error.error?.mensaje || 'Error al completar el pedido');
            })
          )
        );

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
    console.error('Error completo:', error);
    let mensaje = 'Ha ocurrido un error inesperado';

    if (error instanceof HttpErrorResponse) {
      console.error('Status:', error.status);
      console.error('Error body:', error.error);
      mensaje = error.error?.message || error.error?.mensaje || error.message || mensaje;
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
