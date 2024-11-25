import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ReporteVenta {
  afiliado: string;
  compras: number;
  monto_Total: number;
  monto_Servicio: number;
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
  fechaImpresion: string = new Date().toLocaleDateString();
  usuarioImpresion: string = 'marivera';
  isLoading: boolean = false;
  error: string | null = null;
  private apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api/ReporteVentas';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchReporteVentas();
  }

  fetchReporteVentas() {
    this.isLoading = true;
    this.error = null;

    this.http.get<ReporteVenta[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.reporteVentas = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener datos:', error);
          this.error = 'Error al cargar los datos. Por favor, intente nuevamente.';
          this.isLoading = false;
          this.reporteVentas = [];
        }
      });
  }

  calculateTotals() {
    return {
      totalCompras: this.reporteVentas.reduce((sum, item) => sum + item.compras, 0),
      totalMonto: this.reporteVentas.reduce((sum, item) => sum + item.monto_Total, 0),
      totalServicio: this.reporteVentas.reduce((sum, item) => sum + item.monto_Servicio, 0)
    };
  }


}
