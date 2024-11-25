import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { catchError, firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface Pedido {
  num_Pedido: number;
  nombre: string;
  estado: string;
  monto_Total: number;
  id_Repartidor: number;
  cedula_Comercio: string;
}

interface Repartidor {
  id: number;
  usuario: string;
  nombre: string;
  disponible: string;
  apellido1: string;
  apellido2: string;
  correo: string;
}

interface DireccionPedido {
  id_pedido: number;
  provincia: string;
  canton: string;
  distrito: string;
}

interface Cliente {
  cedula: number;
  usuario: string;
  nombre: string;
}

@Component({
  selector: 'app-recepcion-pedido',
  standalone: true,
  imports: [
    CommonModule,
    HeaderClientComponent,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './recepcion-pedido.component.html',
  styleUrls: ['./recepcion-pedido.component.css']
})
export class RecepcionPedidoComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5037/api/';
  pedidos: {
    pedido: Pedido;
    repartidor?: Repartidor;
    direccionPedido?: DireccionPedido;
  }[] = [];
  cargando = false;
  errorMessage: string | null = null;
  cedulaCliente: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.obtenerCedulaCliente();
  }

  private obtenerCedulaCliente(): void {
    let userData = localStorage.getItem('loggedInUser');
    let userType = localStorage.getItem('userType');

    if (!userData || userType !== 'cliente') {
      console.error('No hay usuario logueado o no es un cliente');
      this.router.navigate(['/login']);
      return;
    }

    try {
      let cliente: Cliente = JSON.parse(userData);
      if (!cliente.cedula) {
        throw new Error('No se encontró la cédula del cliente');
      }
      this.cedulaCliente = cliente.cedula;
      console.log('Cédula del cliente:', this.cedulaCliente);
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (this.cedulaCliente) {
      this.cargarPedidos();
    }
  }

  private async cargarPedidos(): Promise<void> {
    try {
      this.cargando = true;

      // Obtener pedidos del cliente específico
      const pedidosResponse = await this.http.get<Pedido>(
        `${this.apiUrl}PedidosCliente/by-cedula/${this.cedulaCliente}`
      ).toPromise();

      if (!pedidosResponse) {
        throw new Error('No se pudieron cargar los pedidos');
      }

      console.log('Pedidos del cliente:', pedidosResponse);

      // Crear un array de pedidos para poder iterar y cargar los detalles
      const pedidosArray = Array.isArray(pedidosResponse) ? pedidosResponse : [pedidosResponse];

      // Para cada pedido, cargar su información relacionada
      this.pedidos = await Promise.all(
        pedidosArray.map(async (pedido) => {
          const detalles = {
            pedido,
            repartidor: undefined as Repartidor | undefined,
            direccionPedido: undefined as DireccionPedido | undefined
          };

          try {
            // Cargar información del repartidor
            if (pedido.id_Repartidor) {
              detalles.repartidor = await this.http.get<Repartidor>(
                `${this.apiUrl}Repartidor/${pedido.id_Repartidor}`
              ).toPromise() || undefined;
              console.log('Repartidor del pedido:', detalles.repartidor);
            }

            // Cargar dirección del pedido
            if (pedido.num_Pedido) {
              detalles.direccionPedido = await this.http.get<DireccionPedido>(
                `${this.apiUrl}DireccionPedido/${pedido.num_Pedido}`
              ).toPromise() || undefined;
              console.log('Dirección del pedido:', detalles.direccionPedido);
            }
          } catch (error) {
            console.error(`Error al cargar detalles del pedido ${pedido.num_Pedido}:`, error);
          }

          return detalles;
        })
      );

      console.log('Pedidos con detalles:', this.pedidos);
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  async confirmarRecepcion(pedidoId: number, repartidorId: number): Promise<void> {
    try {
      let confirmacion = await Swal.fire({
        title: '¿Confirmar recepción del pedido?',
        text: 'Esta acción marcará el pedido como completado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmacion.isConfirmed) {
        this.cargando = true;

        // Llamar al procedimiento almacenado para completar el pedido
        await this.http.put(`${this.apiUrl}Pedido/RecepcionPedido/${pedidoId}`, {}).toPromise();
        console.log('Pedido confirmado:', pedidoId);

        await Swal.fire({
          title: '¡Pedido completado!',
          text: 'Ahora puedes dejar tu feedback sobre la experiencia',
          icon: 'success',
          confirmButtonText: 'Dar Feedback'
        });

        // Guardar el pedido actual en sessionStorage para el componente de feedback
        sessionStorage.setItem('pedido_actual', pedidoId.toString());

        // Redireccionar al componente de feedback
        this.router.navigate(['/feedback']);
      }
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    let mensaje = error.error?.message || error.message || 'Ha ocurrido un error inesperado';
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

  volver(): void {
    this.router.navigate(['/administrar-carrito']);
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
