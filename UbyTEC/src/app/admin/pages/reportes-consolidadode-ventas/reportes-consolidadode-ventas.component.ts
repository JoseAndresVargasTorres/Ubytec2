import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface VentaConsolidada {
  cliente: string;
  afiliado: string;
  conductor: string;
  compras: number;
  monto_Total: number;
  monto_Servicio: number;
}

@Component({
  selector: 'app-reportes-consolidadode-ventas',
  standalone: true,
  imports: [HeaderAdminComponent, CommonModule, FormsModule],
  templateUrl: './reportes-consolidadode-ventas.component.html',
  styleUrl: './reportes-consolidadode-ventas.component.css'
})
export class ReportesConsolidadoVentasComponent implements OnInit {
  ventasConsolidadas: { [key: string]: VentaConsolidada[] } = {};
  fechaImpresion: string = new Date().toLocaleDateString();
  impresoPor: string = 'Usuario Actual';
  isLoading: boolean = false;
  error: string | null = null;
  private apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/ReporteConsolidado';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  cargarDatos() {
    this.isLoading = true;
    this.error = null;

    this.http.get<VentaConsolidada[]>(this.apiUrl)
      .subscribe({
        next: (ventas) => {
          // Reorganizar los datos por cliente
          this.ventasConsolidadas = ventas.reduce((acc: { [key: string]: VentaConsolidada[] }, venta) => {
            if (!acc[venta.cliente]) {
              acc[venta.cliente] = [];
            }
            acc[venta.cliente].push(venta);
            return acc;
          }, {});
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar datos de la API:', error);
          this.error = 'Error al cargar los datos. Por favor, intente nuevamente.';
          this.isLoading = false;
          this.ventasConsolidadas = {};
        }
      });
  }

  calcularTotalesPorCliente(ventas: VentaConsolidada[]) {
    return {
      totalCompras: ventas.reduce((sum, venta) => sum + venta.compras, 0),
      montoTotal: ventas.reduce((sum, venta) => sum + venta.monto_Total, 0),
      montoServicio: ventas.reduce((sum, venta) => sum + venta.monto_Servicio, 0)
    };
  }

  exportarExcel() {
    const data = Object.entries(this.ventasConsolidadas).flatMap(([cliente, ventas]) =>
      ventas.map(venta => ({
        Cliente: venta.cliente,
        Afiliado: venta.afiliado,
        Conductor: venta.conductor,
        Compras: venta.compras,
        MontoTotal: venta.monto_Total,
        MontoServicio: venta.monto_Servicio
      }))
    );

    console.log('Datos para exportar:', data);
  }
}
