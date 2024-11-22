import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    HeaderAdminComponent,
    FormsModule
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

  constructor(private fb: FormBuilder) {
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
    try {
      // Aquí irían las llamadas a la API real
      // const responseValidaciones = await this.validacionService.obtenerValidaciones().toPromise();
      // const responseAfiliacdes = await this.comercioService.obtenerComercios().toPromise();
      // this.solicitudes = responseValidaciones;
      // this.comercios = responseAfiliados;
    } catch (error) {
      console.error('Error al cargar datos de la API:', error);
    }
  }

  obtenerComercio(cedulaComercio: string): ComercioAfiliado | undefined {
    return this.comercios.find(c => c.cedula_Juridica === cedulaComercio);
  }

  async aprobarSolicitud(solicitud: ValidacionComercio) {
    solicitud.estado = 'aprobado';
    if (this.usarMock) {
      // Actualizar localmente
      this.solicitudes = this.solicitudes.map(s =>
        s.id === solicitud.id ? solicitud : s
      );
    } else {
      // Llamada a API
      // await this.validacionService.actualizarValidacion(solicitud).toPromise();
    }
  }

  seleccionarParaRechazo(solicitud: ValidacionComercio) {
    this.solicitudSeleccionada = solicitud;
    this.formRechazo.reset();
  }

  async rechazarSolicitud() {
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
