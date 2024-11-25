import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface UltimaCompra {
  cedulaCliente: number;
  numPedido: number;
  comercioAfiliado: string;
  montoTotal: number;
  feedback: string | null;
  estado: string;
}

interface Cliente {
  cedula: number;
  usuario: string;
  nombre: string;
}

@Component({
  selector: 'app-ultimas-compras',
  standalone: true,
  imports: [
    CommonModule,
    HeaderClientComponent,
    RouterModule,
    FormsModule
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
  usarDatosPrueba = false;

  readonly datosPrueba: UltimaCompra[] = [
    {
      cedulaCliente: 123456789,
      numPedido: 1,
      comercioAfiliado: "Restaurante El Buen Sabor",
      montoTotal: 15000,
      feedback: "Excelente servicio y comida muy rica",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 2,
      comercioAfiliado: "Supermercado La Esquina",
      montoTotal: 45000,
      feedback: "Entrega rápida",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 3,
      comercioAfiliado: "Farmacia Salud",
      montoTotal: 8500,
      feedback: null,
      estado: "En proceso"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 4,
      comercioAfiliado: "Dulcería Caramelo",
      montoTotal: 12000,
      feedback: "Productos frescos",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 5,
      comercioAfiliado: "Restaurante La Parrilla",
      montoTotal: 25000,
      feedback: "Muy buena atención",
      estado: "Finalizado"
    }
  ];

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
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    if (this.cedulaCliente) {
      this.cargarCompras();
    }
  }

  toggleOrigenDatos(): void {
    this.usarDatosPrueba = !this.usarDatosPrueba;
    this.cargarCompras();
  }

  private cargarCompras(): void {
    if (this.usarDatosPrueba) {
      this.ultimasCompras = this.datosPrueba;
      return;
    }

    this.cargarComprasDesdeAPI();
  }

  private cargarComprasDesdeAPI(): void {
    if (!this.cedulaCliente) {
      this.mostrarError('No se pudo obtener la cédula del cliente');
      return;
    }

    this.cargando = true;

    this.http.get<UltimaCompra[]>(`${this.apiUrl}/cliente/${this.cedulaCliente}`)
      .subscribe({
        next: (compras) => {
          this.ultimasCompras = compras.slice(0, 10);
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
