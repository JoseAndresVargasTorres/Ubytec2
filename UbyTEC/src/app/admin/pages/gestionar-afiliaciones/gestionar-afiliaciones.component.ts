import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TableService } from '../../../Services/Table/table.service';
import { ApiService } from '../../../Services/API/api.service';
import { forkJoin } from 'rxjs';
import { ValidacionComercioControllerSQL } from '../../interfaces/comercioafiliado/Validacion_Comercio';

interface ValidacionComercio {
  id: string;
  cedulaComercio: string;
  comentario: string;
  estado: string;
}

interface ComercioAfiliado {
  cedula_Juridica: string;
  nombre: string;
  correo: string;
  sinpe: string;
  id_Tipo: number;
  cedula_Admin: number;
}

@Component({
  selector: 'app-gestionar-afiliaciones',
  standalone: true,
  imports: [ ReactiveFormsModule, MatTableModule, CommonModule, HeaderAdminComponent, FormsModule ],
  templateUrl: './gestionar-afiliaciones.component.html',
  styleUrl: './gestionar-afiliaciones.component.css'
})
export class GestionarAfiliacionesComponent implements OnInit {
  displayedColumns: string[] = [];
  objects = [];
  columns: string[] = ['cedula_Juridica', 'nombre', 'correo'];

  constructor(
    private fb: FormBuilder,
    private api_service: ApiService,
    private table_service: TableService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargarDatosAPI();
  }

  async cargarDatosAPI() {
    this.api_service.getData('ValidacionComercioControllerSQL').subscribe({
      next: res => {
        res.filter((validacion:any) => validacion.estado !== "Aprobado");
        this.getComercios(res);
      },
      error: err => {console.error(err)}
    })
  }

  getComercios(validaciones: {cedula_Comercio: string, cedula_Admin: number, estado: string}[]) {
    const comercio_calls = validaciones.map((validacion: any) =>
      this.api_service.getData(`ComercioAfiliado/${validacion.cedula_Comercio}`)
    );

    forkJoin(comercio_calls).subscribe({
      next: res => {
        this.table_service.showTable(res, this.columns);
        this.objects = this.table_service.objects;
        this.displayedColumns = this.table_service.displayedColumns;
      }
    })
  }

  async aprobarSolicitud(cedula_Comercio: string, cedula_Admin: number) {
    const cuerpo = JSON.stringify({
      cedula_Comercio,
      cedula_Admin,
      estado: "Aprobado"
    });

    this.api_service.putData(`ValidacionComercioControllerSQL/${cedula_Comercio}`, cuerpo).subscribe({
      next: res => {
        console.log(res);
        this.cargarDatos(); // Recargar datos después de aprobar
      },
      error: err => { console.error(err) }
    })
  }

  async rechazarSolicitud(cedula: string) {
    const api1 = this.api_service.deleteData(`ValidacionComercioControllerSQL/${cedula}`);
    const api2 = this.api_service.deleteData(`ComercioAfiliado/${cedula}`);

    forkJoin([api1, api2]).subscribe({
      next: res => {
        console.log(res);
        this.cargarDatos(); // Recargar datos después de rechazar
      },
      error: err => {console.error(err)}
    })
  }
}
