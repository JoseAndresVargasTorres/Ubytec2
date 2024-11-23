import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';
import { PedidosCliente, ComercioAfiliado } from '../../interfaces/allinterfaces';
import Swal from 'sweetalert2';

interface UltimaCompra {
  comercioAfiliado: string;
  monto: number;
  feedback: string;
  fecha: string;
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
  private readonly apiUrl = 'http://localhost:5037/api/';
  private readonly MOCK_DELAY = 800;

  ultimasCompras: UltimaCompra[] = [];
  cargando = false;
  usarDatosPrueba = true;
  errorMessage: string | null = null;

  private readonly mockCompras: UltimaCompra[] = [
    {
      comercioAfiliado: 'Restaurante El Buen Sabor',
      monto: 15000,
      feedback: 'Excelente servicio y comida muy rica',
      fecha: '2024-11-20'
    },
    {
      comercioAfiliado: 'Supermercado Express',
      monto: 45000,
      feedback: 'Entrega rápida, productos en buen estado',
      fecha: '2024-11-18'
    },
    {
      comercioAfiliado: 'Farmacia Central',
      monto: 12000,
      feedback: 'Buen servicio',
      fecha: '2024-11-15'
    },
    {
      comercioAfiliado: 'Dulcería Candy',
      monto: 8000,
      feedback: 'Los dulces llegaron perfectos',
      fecha: '2024-11-12'
    },
    {
      comercioAfiliado: 'Pizza Express',
      monto: 22000,
      feedback: 'Pizza caliente y a tiempo',
      fecha: '2024-11-10'
    },
    {
      comercioAfiliado: 'Restaurante Sabor Casero',
      monto: 18500,
      feedback: 'Comida deliciosa',
      fecha: '2024-11-08'
    },
    {
      comercioAfiliado: 'Mini Super 24/7',
      monto: 32000,
      feedback: 'Buena selección de productos',
      fecha: '2024-11-05'
    },
    {
      comercioAfiliado: 'Farmacia La Salud',
      monto: 9500,
      feedback: 'Entrega rápida de medicamentos',
      fecha: '2024-11-03'
    },
    {
      comercioAfiliado: 'Restaurante Oriental',
      monto: 25000,
      feedback: 'Excelente sushi',
      fecha: '2024-11-01'
    },
    {
      comercioAfiliado: 'Cafetería Aroma',
      monto: 7500,
      feedback: 'El mejor café',
      fecha: '2024-10-30'
    }
  ];

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
      await this.cargarUltimasCompras();
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

  private async cargarUltimasCompras(): Promise<void> {
    try {
      if (this.usarDatosPrueba) {
        await this.simularDelay();
        this.ultimasCompras = [...this.mockCompras];
      } else {
        const pedidosResponse = await this.http.get<PedidosCliente[]>(
          `${this.apiUrl}PedidosCliente`
        ).toPromise();

        if (pedidosResponse) {
          this.ultimasCompras = pedidosResponse.slice(0, 10).map(pedido => ({
            comercioAfiliado: 'Comercio ' + pedido.numPedido,
            monto: 0, // Esto debería venir de la API
            feedback: pedido.feedback || 'Sin feedback',
            fecha: new Date().toISOString().split('T')[0]
          }));
        }
      }
    } catch (error) {
      this.manejarError(error);
      this.ultimasCompras = [...this.mockCompras];
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

  ngOnDestroy(): void {
    this.errorMessage = null;
  }
}
