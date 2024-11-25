import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TableService } from '../../../Services/Table/table.service';
import { ApiService } from '../../../Services/API/api.service';
import { forkJoin } from 'rxjs';

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
  imports: [ ReactiveFormsModule, MatTableModule, CommonModule, HeaderAdminComponent,FormsModule
  ],
  templateUrl: './gestionar-afiliaciones.component.html',
  styleUrl: './gestionar-afiliaciones.component.css'
})
export class GestionarAfiliacionesComponent implements OnInit {
  solicitudes: ValidacionComercio[] = [];
  comercios: ComercioAfiliado[] = [];
  usarMock: boolean = true;
  formRechazo: FormGroup;
  solicitudSeleccionada: ValidacionComercio | null = null;
  displayedColumns: string[] = [];
  objects = [];
  columns: string[] = ['cedula_Juridica', 'nombre', 'correo'];  // Definir las columnas a mostrar

  constructor(private fb: FormBuilder, private api_service: ApiService, private table_service: TableService) {
    this.formRechazo = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  toggleSource() {
    this.usarMock = !this.usarMock;
    this.cargarDatos();
  }

  cargarDatos() {
    if (this.usarMock) {
      this.cargarDatosMock();
    } else {
      this.cargarDatosAPI();
    }
  }

  cargarDatosMock() {
    // Datos de ejemplo
    this.solicitudes = [
      {
        id: '1',
        cedulaComercio: '3101123456',
        comentario: '',
        estado: 'pendiente'
      },
      {
        id: '2',
        cedulaComercio: '3101789012',
        comentario: '',
        estado: 'pendiente'
      }
    ];

    this.comercios = [
      {
        cedula_Juridica: '3101123456',
        nombre: 'Restaurante El Buen Sabor',
        correo: 'info@buensabor.com',
        sinpe: '88888888',
        id_Tipo: 1,
        cedula_Admin: 123456789
      },
      {
        cedula_Juridica: '3101789012',
        nombre: 'Supermercado La Esquina',
        correo: 'info@laesquina.com',
        sinpe: '77777777',
        id_Tipo: 2,
        cedula_Admin: 987654321
      }
    ];
  }

  async cargarDatosAPI() {
    
    this.api_service.getData('ValidacionComercioControllerSQL').subscribe({
      next: res => {
        res.filter((validacion:any) => validacion.estado !== "Aprobado");
        this.getComercios(res);
      }, error: err => {console.error(err)}
    })
  }

  getComercios(validaciones: {cedula_Comercio: string, cedula_Admin: number, estado: string}[]){
    const comercio_calls = validaciones.map((validacion: any) => this.api_service.getData(`ComercioAfiliado/${validacion.cedula_Comercio}`));

    forkJoin(comercio_calls).subscribe({
      next: res => {
        this.table_service.showTable(res, this.columns);  // Mostrar la tabla con los datos y columnas definidos
        this.objects = this.table_service.objects;
        this.displayedColumns = this.table_service.displayedColumns;
      }
    })

    
  }

  obtenerComercio(cedulaComercio: string): ComercioAfiliado | undefined {
    return this.comercios.find(c => c.cedula_Juridica === cedulaComercio);
  }

  async aprobarSolicitud(cedula_Comercio: string, cedula_Admin: number) {
    const cuerpo = JSON.stringify({cedula_Comercio, cedula_Admin, estado:"Aprobado"});
    //const cuerpo_mongo = JSON.stringify({cedulaComercio: cedula_Comercio, comentario: "...", estado:"Aprobado"});

    
    this.api_service.putData(`ValidacionComercioControllerSQL/${cedula_Comercio}`, cuerpo).subscribe({
      next: res => {
        console.log(res)
      },error: err => { console.error(err) }
    })
    
    /** 
    this.api_service.putData(`ValidacionComercio/${cedula_Comercio}`, cuerpo_mongo).subscribe({
      next: res => {
        console.log(res)
      },error: err => { console.error(err) }
    })
    this.cargarDatosAPI();
    */
  }


  seleccionarParaRechazo(solicitud: ValidacionComercio) {
    this.solicitudSeleccionada = solicitud;
    this.formRechazo.reset();
  }

  async rechazarSolicitud(cedula: string) {
    if (this.solicitudSeleccionada && this.formRechazo.valid) {
      this.solicitudSeleccionada.estado = 'rechazado';
      this.solicitudSeleccionada.comentario = this.formRechazo.get('comentario')?.value;

      if (this.usarMock) {
        // Actualizar localmente
        this.solicitudes = this.solicitudes.map(s =>
          s.id === this.solicitudSeleccionada?.id ? this.solicitudSeleccionada : s
        );
      } else {
        // Llamada a API
        // await this.validacionService.actualizarValidacion(this.solicitudSeleccionada).toPromise();
      }

      this.solicitudSeleccionada = null;
    }
  }
}
