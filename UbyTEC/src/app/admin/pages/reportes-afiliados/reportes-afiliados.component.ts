import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormsModule } from '@angular/forms';

interface ReporteVenta {
  afiliado: string;
  compras: number;
  montoTotal: number;
  montoServicio: number;
}

@Component({
  selector: 'app-reportes-afiliados',
  standalone: true,
  imports: [HeaderAdminComponent, CommonModule, FormsModule],
  templateUrl: './reportes-afiliados.component.html',
  styleUrl: './reportes-afiliados.component.css'
})
export class ReportesAfiliadosComponent implements OnInit {
  reporteVentas: ReporteVenta[] = [];
  useMockData: boolean = true;
  fechaImpresion: string = new Date().toLocaleDateString();
  usuarioImpresion: string = 'marivera';

  mockData: ReporteVenta[] = [
    {
      afiliado: "BurgerTec",
      compras: 2,
      montoTotal: 17550.00,
      montoServicio: 877.50
    },
    {
      afiliado: "Pischel",
      compras: 2,
      montoTotal: 45980.00,
      montoServicio: 2299.00
    },
    {
      afiliado: "Tres Marias",
      compras: 2,
      montoTotal: 5349.00,
      montoServicio: 267.45
    }
  ];

  constructor() {}

  ngOnInit() {
    this.toggleDataSource();
  }

  toggleDataSource() {
    if (this.useMockData) {
      this.reporteVentas = this.mockData;
    } else {
      // Aquí iría la llamada a la API
      this.fetchReporteVentas();
    }
  }

  async fetchReporteVentas() {
    try {
      // Implementar llamada a API cuando esté disponible
      const response = await fetch('URL_DE_TU_API/reporte-ventas');
      const data = await response.json();
      this.reporteVentas = data;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      // En caso de error, usar datos mock
      this.reporteVentas = this.mockData;
    }
  }

  calculateTotals() {
    return {
      totalCompras: this.reporteVentas.reduce((sum, item) => sum + item.compras, 0),
      totalMonto: this.reporteVentas.reduce((sum, item) => sum + item.montoTotal, 0),
      totalServicio: this.reporteVentas.reduce((sum, item) => sum + item.montoServicio, 0)
    };
  }
}
