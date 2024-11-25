import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { PedidosCliente, Pedido, Repartidor, ComercioAfiliado, PedidosClienteSQL } from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    HeaderClientComponent,CommonModule,ReactiveFormsModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/';

  feedbackForm: FormGroup;
  pedidoActual: Pedido | null = null;
  repartidor: Repartidor | null = null;
  comercio: ComercioAfiliado | null = null;
  cargando = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.feedbackForm = this.formBuilder.group({
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

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

      const pedidoResponse = await this.http.get<Pedido>(
        `${this.apiUrl}Pedido/${numPedido}`
      ).toPromise();

      if (!pedidoResponse) {
        throw new Error('No se pudo cargar el pedido');
      }

      this.pedidoActual = pedidoResponse;

      await Promise.all([
        this.cargarDatosRepartidor(pedidoResponse.id_Repartidor),
        this.cargarDatosComercio(pedidoResponse.cedula_Comercio)
      ]);
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
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
      this.mostrarError('Por favor ingrese un comentario de al menos 10 caracteres');
      return;
    }

    try {
      this.cargando = true;
      const userData = localStorage.getItem('loggedInUser');
      if (!userData) {
        throw new Error('No se encontró información del usuario');
      }
      const cliente = JSON.parse(userData);

      if (!this.pedidoActual) {
        throw new Error('No se encontró información del pedido');
      }

      const feedbackMongo: PedidosCliente = {
        numPedido: this.pedidoActual.num_Pedido,
        cedulaCliente: cliente.cedula,
        feedback: this.feedbackForm.value.feedback
      };

      const feedbackSQL: PedidosClienteSQL = {
        numPedido: this.pedidoActual.num_Pedido,
        cedulaCliente: cliente.cedula,
      };

      await Promise.all([
        this.http.post(`${this.apiUrl}PedidosCliente`, feedbackMongo).toPromise(),
        this.http.post(`${this.apiUrl}PedidosClienteControllerSQL`, feedbackSQL).toPromise()
      ]);

      await Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu feedback!',
        text: 'Tu opinión nos ayuda a mejorar',
        confirmButtonText: 'Aceptar'
      });

      sessionStorage.removeItem('pedido_actual');
      this.router.navigate(['/entrar-comercios']);
    } catch (error) {
      this.manejarError(error);
    } finally {
      this.cargando = false;
    }
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    const mensaje = error.error?.message || error.message || 'Ha ocurrido un error inesperado';
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


  navigateToMainPage() {
    this.router.navigate(['/entrar-comercios']);
  }

  onSubmitFeedback() {
    this.enviarFeedback();
  }
}
