import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VentaConsolidada {
  cliente: string;
  afiliado: string;
  conductor: string;
  montoTotal: number;
  montoServicio: number;
  compras: number;
}

@Component({
  selector: 'app-reportes-consolidadode-ventas',
  standalone: true,
  imports: [HeaderAdminComponent,CommonModule, FormsModule],
  templateUrl: './reportes-consolidadode-ventas.component.html',
  styleUrl: './reportes-consolidadode-ventas.component.css'
})
export class ReportesConsolidadoVentasComponent implements OnInit {
  ventasConsolidadas: { [key: string]: VentaConsolidada[] } = {};
  usarDatosMock: boolean = true;
  fechaImpresion: string = new Date().toLocaleDateString();
  impresoPor: string = 'Usuario Actual';

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  toggleFuenteDatos() {
    this.usarDatosMock = !this.usarDatosMock;
    this.cargarDatos();
  }

  cargarDatos() {
    if (this.usarDatosMock) {
      this.cargarDatosMock();
    } else {
      this.cargarDatosAPI();
    }
  }

  private cargarDatosMock() {
    this.ventasConsolidadas = {
      'Pedro Perico': [
        {
          cliente: 'Pedro Perico',
          afiliado: 'BugerTec',
          conductor: 'Sebas',
          montoTotal: 17550.00,
          montoServicio: 877.50,
          compras: 2
        },
        {
          cliente: 'Pedro Perico',
          afiliado: 'BugerTec',
          conductor: 'Oscar',
          montoTotal: 3000.00,
          montoServicio: 150.00,
          compras: 1
        },
        {
          cliente: 'Pedro Perico',
          afiliado: 'Pischel',
          conductor: 'Oscar',
          montoTotal: 45980.00,
          montoServicio: 2299.00,
          compras: 2
        },
        {
          cliente: 'Pedro Perico',
          afiliado: 'Tres Marias',
          conductor: 'Nandy',
          montoTotal: 5349.00,
          montoServicio: 267.45,
          compras: 2
        }
      ],
      'Juan Perez': [
        {
          cliente: 'Juan Perez',
          afiliado: 'BugerTec',
          conductor: 'Nandy',
          montoTotal: 3800.00,
          montoServicio: 190.00,
          compras: 1
        },
        {
          cliente: 'Juan Perez',
          afiliado: 'Pischel',
          conductor: 'Charlie',
          montoTotal: 12789.00,
          montoServicio: 639.45,
          compras: 2
        },
        {
          cliente: 'Juan Perez',
          afiliado: 'Pischel',
          conductor: 'Nandy',
          montoTotal: 9800.00,
          montoServicio: 490.00,
          compras: 1
        }
      ]
    };
  }

  private async cargarDatosAPI() {
    try {
      // Aquí iría la llamada a tu API real
      // const response = await fetch('tu-api-endpoint');
      // this.ventasConsolidadas = await response.json();
      console.log('Implementar llamada a API real');
    } catch (error) {
      console.error('Error al cargar datos de la API:', error);
    }
  }

  calcularTotalesPorCliente(ventas: VentaConsolidada[]) {
    return {
      totalCompras: ventas.reduce((sum, venta) => sum + venta.compras, 0),
      montoTotal: ventas.reduce((sum, venta) => sum + venta.montoTotal, 0),
      montoServicio: ventas.reduce((sum, venta) => sum + venta.montoServicio, 0)
    };
  }
}
