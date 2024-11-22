import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { GestionAdministradorComponent } from '../gestion-administrador/gestion-administrador.component';
import { NgFor, NgIf } from '@angular/common';
import { concat } from 'rxjs';
import { EmailService } from '../../../Services/Email/email.service';

@Component({
  selector: 'app-solicitud-afiliacion',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './solicitud-afiliacion.component.html',
  styleUrl: './solicitud-afiliacion.component.css'
})
export class SolicitudAfiliacionComponent {
  phones: string[] = [''];
  tipoOptions: string[] = ['Comida Rápida', 'Comida Italiana', 'Comida Mexicano', 'India', 'China', 'Japonesaq'];
  adminAdded = false;
  admin: any = {};
  admin_phones: number[] = [];

  constructor(private api: ApiService, private router:Router, private dialog: MatDialog, private email_service: EmailService){}

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
      telefonos: phones
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
        this.admin_phones = result.phones;
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
    const { cedula, usuario, nombre: nombreAdmin, apellido1, apellido2, provincia: provinciaAdmin, canton: cantonAdmin, distrito: distritoAdmin} = this.admin;
    const { cedula_Juridica, nombre, id_Tipo, provincia, canton, distrito, correo, sinpe} = form;

    const new_password = this.generatePassword(8);
    //this.sendEmail(nombreAdmin, correo, usuario, new_password);

    const cuerpo_comercio = JSON.stringify({cedula_Juridica, nombre, correo, sinpe, id_Tipo, cedula_Admin: cedula});
    const cuerpo_direccion = JSON.stringify({id_Comercio: cedula_Juridica, provincia, canton, distrito}); 
    const cuerpo_admin = JSON.stringify({cedula, usuario, password: new_password, nombre: nombreAdmin, apellido1, apellido2})
    const cuerpo_direccion_admin = JSON.stringify({id_Admin: cedula, provincia: provinciaAdmin, canton: cantonAdmin, distrito: distritoAdmin});
    const cuerpo_telefonos = JSON.stringify(this.phones.map(phone => ({cedula_Comercio: cedula_Juridica, telefono: phone})));
    const cuerpo_telefonos_admin = JSON.stringify(this.phones.map(phone => ({ cedula_Admin: cedula, telefono: phone})));


    const apiCalls = [this.api.postData("Administrador", cuerpo_admin),
                      this.api.postData("DireccionAdministrador", cuerpo_direccion_admin),
                      this.api.postData("TelefonoAdmin", cuerpo_telefonos_admin),
                      this.api.postData("ComercioAfiliado", cuerpo_comercio),
                      this.api.postData("DireccionComercio",cuerpo_direccion),
                      this.api.postData("TelefonoComercio", cuerpo_telefonos)
                      ]

    concat(...apiCalls).subscribe({
      next: res => { 
        console.log(res);
        this.router.navigate(['']);
      },
      error: err => { console.error(err) }
    });
  }
}