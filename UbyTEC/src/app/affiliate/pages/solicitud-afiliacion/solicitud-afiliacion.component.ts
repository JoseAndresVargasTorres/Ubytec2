import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { GestionAdministradorComponent } from '../gestion-administrador/gestion-administrador.component';
import { NgFor, NgIf } from '@angular/common';
import { concat } from 'rxjs';
import { EmailService } from '../../../Services/Email/email.service';
import { AuthService } from '../../../Services/auth/auth.service';
import { TipoComercioService } from '../../../admin/services/ServicioTipoComercio/tipo-comercio.service';
import {
  TipoComercio,
  ComercioAfiliado,
  DireccionComercio,
  TelefonoComercio,
  Administrador,
  DireccionAdministrador,
  TelefonoAdmin,
  ValidacionComercio,
  ValidacionComercioControllerSQL
} from '../../../client/interfaces/allinterfaces';


@Component({
  selector: 'app-solicitud-afiliacion',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './solicitud-afiliacion.component.html',
  styleUrl: './solicitud-afiliacion.component.css'
})
export class SolicitudAfiliacionComponent implements OnInit {
  phones: string[] = [''];
  tiposComercio: TipoComercio[] = [];
  tipoOptions: string[] = ['Comida Rápida', 'Comida Italiana', 'Comida Mexicano', 'India', 'China', 'Japonesaq'];
  adminAdded = false;
  admin: any = {};
  admin_phones: string[] = [];
  loading = false;
  errorCarga = false;

  provincias: string[] = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón'
  ];

  formData: {
    cedula_Juridica: string;
    nombre: string;
    correo: string;
    sinpe: string;
    id_Tipo: number;
    provincia: string;
    canton: string;
    distrito: string;
  } = {
    cedula_Juridica: '',
    nombre: '',
    correo: '',
    sinpe: '',
    id_Tipo: 0,
    provincia: '',
    canton: '',
    distrito: ''
  };

  constructor(private api: ApiService,
              private router:Router, private dialog: MatDialog,
              private email_service: EmailService,
              private tipoComercioService: TipoComercioService,
              ){}

   ngOnInit() {
    this.cargarTiposComercio();
  }

  private cargarTiposComercio() {
    this.loading = true;
    this.api.getData('TipoComercio').subscribe({
      next: (tipos) => {
        this.tiposComercio = tipos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de comercio:', error);
        this.errorCarga = true;
        this.loading = false;
      }
    });
  }
  // Function to add a new phone field
  addPhone() {
    this.phones.push('');
  }

  // Function to remove a phone field by index
  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }

  addComercioPhones(cedula: string, phones: string[]) {
    return JSON.stringify({
      cedula_Comercio: cedula,
      telefonos: phones
    });
  }

  addAdminPhones(cedula: string, phones: string[]) {
    return JSON.stringify({
      cedula_Admin: cedula,
      telefonos: phones.map(phone => phone.toString()) // Asegurar que sean strings
    });
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  openAdminDialog() {
    const dialogRef = this.dialog.open(GestionAdministradorComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminAdded = true;
        this.admin = result.data;
        // Asegurarse de que los teléfonos se guarden como strings
        this.admin_phones = result.phones.map((phone: any) => phone.toString());
      }
    });
  }

  generatePassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  sendEmail(nombre: string, correo: string, usuario: string, password: string) {
    const templateParams = {
      to_name: nombre,
      to_email: correo,
      from_name: 'UbyTec',
      message: `Gracias por afiliarte con nosotros. \n Tu usuario es ${usuario}  y tu contraseña es ${password}`,
    };

    this.email_service.sendEmail(templateParams);
  }

  // Método para manejar el envío del formulario
  submit(form: any) {
    const comercioAfiliado: ComercioAfiliado = {
      cedula_Juridica: this.formData.cedula_Juridica,
      nombre: this.formData.nombre,
      correo: this.formData.correo,
      sinpe: this.formData.sinpe,
      id_Tipo: this.formData.id_Tipo,
      cedula_Admin: this.admin.cedula
    };

    const direccionComercio: DireccionComercio = {
      id_Comercio: this.formData.cedula_Juridica,
      provincia: this.formData.provincia,
      canton: this.formData.canton,
      distrito: this.formData.distrito
    };

    const telefonosComercio: TelefonoComercio[] = this.phones.map(phone => ({
      cedula_Comercio: this.formData.cedula_Juridica,
      telefono: phone
    }));

    const direccionAdmin: DireccionAdministrador = {
      id_Admin: this.admin.cedula,
      provincia: this.admin.provincia,
      canton: this.admin.canton,
      distrito: this.admin.distrito
    };

    const telefonosAdmin: TelefonoAdmin[] = this.admin_phones.map(phone => ({
      cedula_Admin: this.admin.cedula,
      telefono: phone // Ahora phone ya es string
    }));

    const new_password = this.generatePassword(8);

    const administrador: Administrador = {
      ...this.admin,
      password: new_password
    };

    const validacion: ValidacionComercio = {
      cedulaComercio: this.formData.cedula_Juridica,
      comentario: "...",
      estado: "no aprobado"
    } 

    const validacion2: ValidacionComercioControllerSQL = {
      cedula_Admin: this.admin.cedula,
      cedula_Comercio: this.formData.cedula_Juridica,
      estado: "Pendiente"
    }

    const apiCalls = [
      this.api.postData("Administrador", JSON.stringify(administrador)),
      this.api.postData("DireccionAdministrador", JSON.stringify(direccionAdmin)),
      this.api.postData("TelefonoAdmin", JSON.stringify(telefonosAdmin)),
      this.api.postData("ComercioAfiliado", JSON.stringify(comercioAfiliado)),
      this.api.postData("DireccionComercio", JSON.stringify(direccionComercio)),
      this.api.postData("TelefonoComercio", JSON.stringify(telefonosComercio)),
      this.api.postData("ValidacionComercio", JSON.stringify(validacion)),
      this.api.postData("ValidacionComercioControllerSQL", JSON.stringify(validacion2))
    ];

    concat(...apiCalls).subscribe({
      next: res => {
        console.log(res);
        this.sendEmail(this.admin.nombre, this.admin.correo, this.admin.usuario, new_password);
        this.router.navigate(['']);
      },
      error: err => {
        console.error(err);
      }
    });
  }

}
