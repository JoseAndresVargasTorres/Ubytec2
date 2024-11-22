import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Cliente } from '../../interfaces/allinterfaces';
import { ClienteService } from '../../services/ClienteAPI/cliente.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TelefonoCliente } from '../../interfaces/allinterfaces';
import { DireccionCliente } from '../../interfaces/allinterfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { HeaderClientComponent } from '../../components/header-client/header-client.component';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [ClienteService,HeaderClientComponent],
  templateUrl: './gestion-clientes.component.html',
  styleUrl: './gestion-clientes.component.css'
})
export class GestionClientesComponent implements OnInit {
  clienteForm: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  currentCliente: Cliente | null = null;
  currentClienteDireccion: DireccionCliente | null = null;
  clientes: Cliente[] = [];
  direcciones_cliente: DireccionCliente[] = [];
  telefonos_cliente: TelefonoCliente[] = [];

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {

    this.clienteForm = this.fb.group({
      cedula: ['', Validators.required],
      password: ['', [Validators.required]],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha_Nacimiento: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosCliente: this.fb.array([
        this.createTelefonoFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.getAllClientes();
    this.getAllDirecciones();
    this.getAllTelefonos();
  }




  private buildClienteObject(data: any): Cliente {
    const cedula = parseInt(data.cedula);
    if (!cedula || isNaN(cedula)) {
      throw new Error('Cédula inválida');
    }

    return {
      cedula: cedula,
      usuario: data.correo?.split('@')[0] || '',
      password: data.password?.trim() || '',
      nombre: data.nombre?.trim() || '',
      apellido1: data.apellido1?.trim() || '',
      apellido2: data.apellido2?.trim() || '',
      correo: data.correo?.trim() || '',
      fecha_Nacimiento: new Date(data.fecha_Nacimiento)
    };
  }

  private buildDireccionObject(data: any, cedulaCliente: number): DireccionCliente {
    if (!cedulaCliente || isNaN(cedulaCliente)) {
      throw new Error('Cédula inválida para la dirección');
    }

    return {
      id_Cliente: cedulaCliente,
      provincia: data.provincia?.trim() || '',
      canton: data.canton?.trim() || '',
      distrito: data.distrito?.trim() || ''
    };
  }

  private buildTelefonosArray(telefonos: any[], cedulaCliente: number): TelefonoCliente[] {
    if (!cedulaCliente || isNaN(cedulaCliente)) {
      throw new Error('Cédula inválida para los teléfonos');
    }

    return telefonos.map(tel => ({
      cedula_Cliente: cedulaCliente,
      telefono: tel.telefono?.trim() || ''
    }));
  }

  private createNewCliente(clienteData: any, cedulaCliente: number): void {
    let clienteToAdd = this.buildClienteObject(clienteData);
    let direccionToAdd = this.buildDireccionObject(clienteData, cedulaCliente);
    let telefonosToAdd = this.buildTelefonosArray(this.telefonosFormArray.value, cedulaCliente);

    this.clienteService.createCliente(clienteToAdd).subscribe({
      next: (clienteResponse) => {
        console.log('Cliente creado:', clienteResponse);
        this.clienteService.createDireccionCliente(direccionToAdd).subscribe({
          next: (direccionResponse) => {
            console.log('Dirección creada:', direccionResponse);
            this.clienteService.createTelefonosCliente(telefonosToAdd).subscribe({
              next: (telefonosResponse) => {
                console.log('Teléfonos creados:', telefonosResponse);
                this.getAllTelefonos();
                this.showSuccess('Cliente y datos relacionados creados correctamente');
              },
              error: (error) => {
                console.error('Error al crear los teléfonos:', error);
                this.handleError('Error al crear los teléfonos');
              }
            });
            this.resetForm();
            this.updateAllData();
          },
          error: (error) => {
            console.error('Error al crear la dirección:', error);
            this.handleError('Error al crear la dirección');
          }
        });
      },
      error: (error) => {
        console.error('Error al crear el cliente:', error);
        this.handleError('Error al crear el cliente');
      }
    });
  }

  private updateExistingCliente(clienteData: any): void {
    let cedula = parseInt(clienteData.cedula);
    let clienteToUpdate = this.buildClienteObject(clienteData);
    let direccionToUpdate = this.buildDireccionObject(clienteData, cedula);
    let telefonosToUpdate = this.buildTelefonosArray(this.telefonosFormArray.value, cedula);

    this.clienteService.updateCliente(clienteToUpdate).subscribe({
      next: (clienteResponse) => {
        console.log('Cliente actualizado:', clienteResponse);
        this.clienteService.updateDireccionCliente(direccionToUpdate).subscribe({
          next: (direccionResponse) => {
            console.log('Dirección actualizada:', direccionResponse);
            this.updateTelefonos(cedula, telefonosToUpdate);
            this.resetForm();
            this.updateAllData();
          },
          error: (error) => {
            console.error('Error al actualizar la dirección:', error);
            this.handleError('Error al actualizar la dirección');
          }
        });
      },
      error: (error) => {
        console.error('Error al actualizar el cliente:', error);
        this.handleError('Error al actualizar el cliente');
      }
    });
  }

  private updateTelefonos(cedula: number, telefonos: TelefonoCliente[]): void {
    this.clienteService.putTelefonosCliente(cedula, telefonos).subscribe({
      next: (response) => {
        console.log('Teléfonos actualizados:', response);
        this.clienteService.getAllTelefonosCliente().subscribe({
          next: (telefonos) => {
            this.telefonos_cliente = telefonos;
            this.showSuccess('Cliente y datos relacionados actualizados correctamente');
          },
          error: (error) => {
            console.error('Error al recargar teléfonos:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al actualizar teléfonos:', error);
        this.handleError('Error al actualizar los teléfonos');
      }
    });
  }


  editCliente(cedula: number): void {
    this.editMode = true;
    this.setActiveTab('crear');
    console.log("cedula cliente ", cedula);
    this.loadClienteData(cedula);
  }

  private loadClienteData(cedula: number): void {
    this.loadClienteDetails(cedula);
    this.loadClienteDireccion(cedula);
    this.loadClienteTelefonos(cedula);
  }

  private loadClienteDetails(cedula: number): void {
    this.clienteService.getOneCliente(cedula).subscribe({
      next: (clienteData) => {
        this.patchClienteForm(clienteData);
      },
      error: (error) => console.error('Error al obtener el cliente:', error)
    });
  }

  private loadClienteDireccion(cedula: number): void {
    this.clienteService.getDireccionCliente(cedula).subscribe({
      next: (direccionData) => {
        this.patchDireccionForm(direccionData);
      },
      error: (error) => console.error('Error al obtener la dirección del cliente:', error)
    });
  }

  private loadClienteTelefonos(cedula: number): void {
    this.clienteService.getTelefonosCliente(cedula).subscribe({
      next: (telefonosData) => {
        this.updateTelefonosFormArray(telefonosData);
      },
      error: (error) => console.error('Error al obtener los teléfonos del cliente:', error)
    });
  }

  private patchClienteForm(clienteData: Cliente): void {
    this.clienteForm.patchValue({
      cedula: clienteData.cedula,
      password: clienteData.password,
      nombre: clienteData.nombre,
      apellido1: clienteData.apellido1,
      apellido2: clienteData.apellido2,
      correo: clienteData.correo,
      fecha_Nacimiento: this.formatDateForInput(clienteData.fecha_Nacimiento)
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private patchDireccionForm(direccionData: DireccionCliente): void {
    this.clienteForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
    });
  }

  // Métodos de utilidad
  private handleError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error'
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success'
    });
  }

  private handleDeleteSuccess(): void {
    this.updateAllData();
    Swal.fire({
      title: 'Eliminado',
      text: 'El cliente ha sido eliminado correctamente',
      icon: 'success'
    });
  }

  private handleDeleteError(entity: string): void {
    console.error(`Error en el proceso de eliminación de ${entity}`);
    Swal.fire({
      title: 'Error',
      text: `Error al eliminar ${entity}. Por favor, inténtelo de nuevo`,
      icon: 'error'
    });
  }

  private updateAllData(): void {
    forkJoin({
      clientes: this.clienteService.getClientes(),
      direcciones: this.clienteService.getDireccionesCliente(),
      telefonos: this.clienteService.getAllTelefonosCliente()
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.direcciones_cliente = data.direcciones;
        this.telefonos_cliente = data.telefonos;
      },
      error: (error) => {
        console.error('Error al actualizar los datos:', error);
        this.handleError('Error al actualizar la información');
      }
    });
  }

  private clearFormData(): void {
    this.currentCliente = null;
    this.currentClienteDireccion = null;
    this.resetForm();
  }

  cancelEdit(): void {
    this.clearFormData();
    this.editMode = false;
    this.setActiveTab('lista');
  }

  // Método para validar campos del formulario
  isFieldInvalid(field: string): boolean {
    const control = this.clienteForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.clienteForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Por favor ingrese un correo válido';
    }
    return '';
  }


  // Métodos para obtener datos
getAllClientes(): void {
  this.clienteService.getClientes().subscribe(
    (data: Cliente[]) => {
      this.clientes = data;
      console.log('Clientes cargados:', this.clientes);
    },
    error => {
      console.error('Error al cargar los clientes:', error);
    }
  );
}

getAllDirecciones(): void {
  this.clienteService.getDireccionesCliente().subscribe(
    (data: DireccionCliente[]) => {
      this.direcciones_cliente = data;
      console.log('Direcciones cargadas:', this.direcciones_cliente);
    },
    error => {
      console.error('Error al cargar las direcciones:', error);
    }
  );
}

getAllTelefonos(): void {
  this.clienteService.getAllTelefonosCliente().subscribe(
    (data: TelefonoCliente[]) => {
      this.telefonos_cliente = data;
      console.log('Teléfonos cargados:', this.telefonos_cliente);
    },
    error => {
      console.error('Error al cargar los teléfonos:', error);
    }
  );
}

// Métodos para el manejo de teléfonos
createTelefonoFormGroup(): FormGroup {
  return this.fb.group({
    telefono: ['', Validators.required]
  });
}

get telefonosFormArray(): FormArray {
  return this.clienteForm.get('TelefonosCliente') as FormArray;
}

addTelefonoRegister() {
  let telefonoGroup = this.fb.group({
    telefono: ['', Validators.required]
  });
  this.telefonosFormArray.push(telefonoGroup);
}

removeTelefonoRegister(index: number) {
  if(this.telefonosFormArray.length > 1) {
    this.telefonosFormArray.removeAt(index);
  }
}

// Método para establecer pestaña activa
setActiveTab(tab: string) {
  this.activeTab = tab;
}

getDireccionByCedula(cedula: number): DireccionCliente | undefined {
  return this.direcciones_cliente.find(direccion => direccion.id_Cliente === cedula);
}

// Método para eliminar cliente y datos relacionados
deleteallInfoCliente(cedula: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará toda la información del cliente y no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.clienteService.deleteTelefonosCliente(cedula).subscribe({
        next: () => {
          this.clienteService.deleteDireccionCliente(cedula).subscribe({
            next: () => {
              this.clienteService.deleteCliente(cedula).subscribe({
                next: () => {
                  this.handleDeleteSuccess();
                },
                error: (error) => {
                  console.error('Error al eliminar cliente:', error);
                  this.handleDeleteError('cliente');
                }
              });
            },
            error: (error) => {
              console.error('Error al eliminar dirección:', error);
              this.handleDeleteError('dirección');
            }
          });
        },
        error: (error) => {
          console.error('Error al eliminar teléfonos:', error);
          this.handleDeleteError('teléfonos');
        }
      });
    }
  });
}

// Método para guardar cliente
saveCliente(): void {
  if (this.clienteForm.valid) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: this.editMode ? 'Se actualizará la información del cliente' : 'Se creará un nuevo cliente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let clienteData = this.clienteForm.value;
        let cedulaCliente = parseInt(clienteData.cedula);

        if (!this.editMode) {
          this.createNewCliente(clienteData, cedulaCliente);
        } else {
          this.updateExistingCliente(clienteData);
        }
      }
    });
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos',
      icon: 'error'
    });
  }
}

// Método para resetear el formulario
private resetForm(): void {
  this.clienteForm.reset();
  this.telefonosFormArray.clear();
  this.telefonosFormArray.push(this.createTelefonoFormGroup());
  this.editMode = false;
}

private updateTelefonosFormArray(telefonosData: TelefonoCliente[]): void {
  const telefonosArray = this.clienteForm.get('TelefonosCliente') as FormArray;
  telefonosArray.clear();

  telefonosData.forEach((telefono) => {
    telefonosArray.push(this.fb.group({
      telefono: telefono.telefono
    }));
  });
}
}
