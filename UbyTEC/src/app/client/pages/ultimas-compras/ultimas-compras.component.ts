import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import Swal from 'sweetalert2';

interface UltimaCompra {
  cedulaCliente: number;
  numPedido: number;
  comercioAfiliado: string;
  montoTotal: number;
  feedback: string;
  estado: string;
}

interface Cliente {
  cedula: number;
  usuario: string;
  nombre: string;
  // ... otros campos que pueda tener el cliente
}

@Component({
  selector: 'app-ultimas-compras',
  standalone: true,
  imports: [
    CommonModule,
    HeaderClientComponent,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './ultimas-compras.component.html',
  styleUrls: ['./ultimas-compras.component.css']
})
export class UltimasComprasComponent implements OnInit {
  private readonly apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/UltimasCompras';
  cedulaCliente: number | null = null;
  ultimasCompras: UltimaCompra[] = [];
  cargando = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.obtenerCedulaCliente();
  }

  private obtenerCedulaCliente(): void {
    const userData = localStorage.getItem('loggedInUser');
    const userType = localStorage.getItem('userType');

    if (!userData || userType !== 'cliente') {
      console.error('No hay usuario logueado o no es un cliente');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const cliente: Cliente = JSON.parse(userData);
      if (!cliente.cedula) {
        throw new Error('No se encontró la cédula del cliente');
      }
      this.cedulaCliente = cliente.cedula;
      console.log('Cédula obtenida:', this.cedulaCliente);
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    if (this.cedulaCliente) {
      this.cargarUltimasCompras();
    }
  }

  private cargarUltimasCompras(): void {
    if (!this.cedulaCliente) {
      this.mostrarError('No se pudo obtener la cédula del cliente');
      return;
    }

    this.cargando = true;
    console.log("Cargando compras para cédula:", this.cedulaCliente);

    this.http.get<UltimaCompra[]>(`${this.apiUrl}/cliente/${this.cedulaCliente}`)
      .subscribe({
        next: (compras) => {
          console.log('Compras recibidas:', compras);
          this.ultimasCompras = compras;
          this.cargando = false;
        },
        error: (error) => {
          this.manejarError(error);
          this.cargando = false;
        }
      });
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
}
