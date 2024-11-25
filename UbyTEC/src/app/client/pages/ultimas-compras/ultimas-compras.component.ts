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
  usarDatosPrueba = true; // Changed to true to always show test data

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
    },
    {
      cedulaCliente: 123456789,
      numPedido: 6,
      comercioAfiliado: "Panadería El Pan Dorado",
      montoTotal: 9500,
      feedback: "Pan siempre fresco y caliente",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 7,
      comercioAfiliado: "Librería Conocimiento",
      montoTotal: 32000,
      feedback: "Gran variedad de libros",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 8,
      comercioAfiliado: "Verdulería Fresh",
      montoTotal: 18500,
      feedback: null,
      estado: "En proceso"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 9,
      comercioAfiliado: "Cafetería Aroma",
      montoTotal: 7500,
      feedback: "El mejor café de la ciudad",
      estado: "Finalizado"
    },
    {
      cedulaCliente: 123456789,
      numPedido: 10,
      comercioAfiliado: "Ferretería Constructor",
      montoTotal: 65000,
      feedback: "Excelente asesoría técnica",
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
    // Always use test data
    this.ultimasCompras = this.datosPrueba;
  }

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
