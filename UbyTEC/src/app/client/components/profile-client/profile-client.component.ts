import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/ClienteAPI/cliente.service';
import { Cliente, DireccionCliente, TelefonoCliente } from '../../interfaces/allinterfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderClientComponent } from '../header-client/header-client.component';

@Component({
  selector: 'app-profile-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderClientComponent],
  templateUrl: './profile-client.component.html',
  styleUrl: './profile-client.component.css'
})
export class ProfileClientComponent implements OnInit {
  clienteForm: FormGroup;
  cliente: Cliente | null = null;
  direccion: DireccionCliente | null = null;
  telefonos: TelefonoCliente[] = [];
  isEditing = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.clienteForm = this.createForm();
  }

  ngOnInit() {
    this.loadClienteData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      datosPersonales: this.fb.group({
        cedula: [{ value: '', disabled: true }],
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido1: ['', [Validators.required, Validators.minLength(2)]],
        apellido2: ['', [Validators.required, Validators.minLength(2)]],
        correo: ['', [Validators.required, Validators.email]],
        fecha_Nacimiento: ['', Validators.required],
        usuario: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }),
      direccion: this.fb.group({
        provincia: ['', Validators.required],
        canton: ['', Validators.required],
        distrito: ['', Validators.required]
      }),
      telefonos: this.fb.array([])
    });
  }

  addTelefono(telefono: string = '') {
    const telefonosArray = this.clienteForm.get('telefonos') as FormArray;
    telefonosArray.push(
      this.fb.control(telefono, [
        Validators.required,
        Validators.pattern('^[0-9]{8}$')
      ])
    );
  }

  removeTelefono(index: number) {
    const telefonosArray = this.clienteForm.get('telefonos') as FormArray;
    telefonosArray.removeAt(index);
  }


  private loadClienteData() {
    this.loading = true;

    try {
      // Obtener datos del usuario del localStorage
      const userDataStr = localStorage.getItem('loggedInUser');
      console.log('Raw localStorage data:', userDataStr); // Debug log

      if (!userDataStr) {
        throw new Error('No hay datos de usuario');
      }

      // Intentar parsear los datos
      let userData;
      try {
        userData = JSON.parse(userDataStr);
      } catch (e) {
        console.error('Error parsing userData:', e);
        userData = userDataStr; // Si ya es un objeto
      }

      console.log('Parsed user data:', userData); // Debug log

      // Si los datos ya están en el formato correcto, usarlos directamente
      if (userData && userData.cedula) {
        this.cliente = userData;

        // Actualizar el formulario con los datos existentes
        const datosPersonalesGroup = this.clienteForm.get('datosPersonales');
        if (datosPersonalesGroup) {
          datosPersonalesGroup.patchValue({
            cedula: userData.cedula,
            nombre: userData.nombre,
            apellido1: userData.apellido1,
            apellido2: userData.apellido2,
            correo: userData.correo,
            fecha_Nacimiento: this.formatDate(userData.fecha_Nacimiento),
            usuario: userData.usuario,
            password: userData.password
          });
        }

        // Cargar datos adicionales
        this.loadDireccion(userData.cedula);
        this.loadTelefonos(userData.cedula);
      } else {
        throw new Error('Datos de usuario incompletos');
      }
    } catch (error) {
      console.error('Error in loadClienteData:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos del perfil',
        icon: 'error'
      }).then(() => {
        this.router.navigate(['/']);
      });
    } finally {
      this.loading = false;
    }
}


  private loadDireccion(cedula: number) {
    this.clienteService.getDireccionCliente(cedula).subscribe({
      next: (direccion) => {
        this.direccion = direccion;
        this.updateForm();
      },
      error: (error) => {
        console.error('Error cargando dirección:', error);
      }
    });
  }

  private loadTelefonos(cedula: number) {
    this.clienteService.getTelefonosCliente(cedula).subscribe({
      next: (telefonos) => {
        this.telefonos = telefonos;
        const telefonosArray = this.clienteForm.get('telefonos') as FormArray;
        telefonosArray.clear();
        telefonos.forEach(tel => this.addTelefono(tel.telefono));
      },
      error: (error) => {
        console.error('Error cargando teléfonos:', error);
      },
      complete: () => this.loading = false
    });
  }


  // Actualizar el método formatDate para manejar el formato específico

  private updateForm() {
    if (this.cliente) {
        try {
            const datosPersonalesGroup = this.clienteForm.get('datosPersonales');
            if (datosPersonalesGroup) {
                datosPersonalesGroup.patchValue({
                    cedula: this.cliente.cedula,
                    nombre: this.cliente.nombre,
                    apellido1: this.cliente.apellido1,
                    apellido2: this.cliente.apellido2,
                    correo: this.cliente.correo,
                    fecha_Nacimiento: this.formatDate(this.cliente.fecha_Nacimiento),
                    usuario: this.cliente.usuario,
                    password: this.cliente.password
                }, { emitEvent: false });
            }
        } catch (error) {
            console.error('Error updating form:', error);
        }
    }

    if (this.direccion) {
        try {
            const direccionGroup = this.clienteForm.get('direccion');
            if (direccionGroup) {
                direccionGroup.patchValue({
                    provincia: this.direccion.provincia,
                    canton: this.direccion.canton,
                    distrito: this.direccion.distrito
                }, { emitEvent: false });
            }
        } catch (error) {
            console.error('Error updating direccion:', error);
        }
    }
}

  private formatDate(date: Date | string): string {
    if (!date) return '';

    try {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      if (typeof date === 'string' && date.includes('T')) {
        return date.split('T')[0];
      }
      return date.toString();
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updateForm();
    }
  }

  onSubmit() {
    if (this.clienteForm.invalid || !this.cliente) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    this.loading = true;
    const formData = this.clienteForm.value;

    const clienteUpdated: Cliente = {
      ...this.cliente,
      ...formData.datosPersonales
    };

    const direccionUpdated: DireccionCliente = {
      ...this.direccion!,
      ...formData.direccion,
      id_Cliente: this.cliente.cedula
    };

    const telefonosUpdated: TelefonoCliente[] = formData.telefonos.map((telefono: string) => ({
      cedula_Cliente: this.cliente!.cedula,
      telefono: telefono
    }));

    this.clienteService.updateCliente(clienteUpdated).subscribe({
      next: () => {
        this.clienteService.updateDireccionCliente(direccionUpdated).subscribe({
          next: () => {
            this.clienteService.putTelefonosCliente(this.cliente!.cedula, telefonosUpdated).subscribe({
              next: () => {
                Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
                this.isEditing = false;
                this.loadClienteData();
              },
              error: this.handleError.bind(this)
            });
          },
          error: this.handleError.bind(this)
        });
      },
      error: this.handleError.bind(this),
      complete: () => this.loading = false
    });
  }

  private handleError(error: any) {
    console.error('Error en la operación:', error);
    Swal.fire('Error', 'Ocurrió un error al actualizar el perfil', 'error');
    this.loading = false;
  }

  get telefonosFormArray() {
    return this.clienteForm.get('telefonos') as FormArray;
  }
}
