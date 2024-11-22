import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { AdminAppServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-gestionar-administradores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, HttpClientModule ,HeaderAdminComponent],
  providers:[AdminAppServiceService],
  templateUrl: './gestionar-administradores.component.html',
  styleUrl: './gestionar-administradores.component.css'
})
export class GestionarAdministradoresComponent implements OnInit {
  adminForm: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray: FormArray;
  currentAdmin: AdministradorApp | null = null;
  currentAdminDireccion: Direccion_AdministradorApp | null = null;
  administradores: AdministradorApp[] = [];
  direcciones_administrador: Direccion_AdministradorApp[] = [];
  telefonos_admin: Telefono_AdminApp[] = [];

  constructor(private fb: FormBuilder, private adminAppService:AdminAppServiceService) {
    this.telefonosFormArray = this.fb.array([]);

    this.adminForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', [Validators.required]],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosAdmin: this.fb.array([
        this.createTelefonoFormGroup() // Crear el primer grupo por defecto
      ])
    });
  }

  ngOnInit(): void {
    this.getAllAdministradores();
    this.getAllDirecciones();
    this.getAllTelefonos();
  }

// Obtener todos los administradores de app
getAllAdministradores(): void {
  this.adminAppService.getAdminApps().subscribe(
    (data: AdministradorApp[]) => {
      this.administradores = data;
      console.log('Administradores App cargados:', this.administradores);
    },
    error => {
      console.error('Error al cargar los administradores de app:', error);
    }
  );
}

// Obtener todas las direcciones de administradores de app
getAllDirecciones(): void {
  this.adminAppService.getDireccionesAdminApp().subscribe(
    (data: Direccion_AdministradorApp[]) => {
      this.direcciones_administrador = data;
      console.log('Direcciones cargadas:', this.direcciones_administrador);
    },
    error => {
      console.error('Error al cargar las direcciones:', error);
    }
  );
}

// Obtener todos los teléfonos de administradores de app
getAllTelefonos(): void {
  this.adminAppService.getAllTelefonosAdminApp().subscribe(
    (data: Telefono_AdminApp[]) => {
      this.telefonos_admin = data;
      console.log('Teléfonos cargados:', this.telefonos_admin);
    },
    error => {
      console.error('Error al cargar los teléfonos administradores:', error);
    }
  );
}

/*TELEFONOS */
//Teléfono Form Methods
createTelefonoFormGroup(): FormGroup {
  return this.fb.group({
    telefono: ['', Validators.required]
  });
}

get telefonos() {
  return (this.adminForm.get('TelefonosAdmin') as FormArray);
}

addTelefonoRegister() {
  let telefonoGroup = this.fb.group({
    telefono: ['', Validators.required]
  });
  this.telefonos.push(telefonoGroup);
}

removeTelefonoRegister(index: number) {
  if(this.telefonos.length > 1) {
    this.telefonos.removeAt(index);
  }
}

getTelefonosByCedulaRegister(cedula: number): Telefono_AdminApp[] {
  // Asegurarse de que telefonos_admin esté inicializado
  if (!this.telefonos_admin) {
    this.getAllTelefonos();
    return [];
  }
  return this.telefonos_admin.filter(tel => tel.cedula_Admin === cedula);
}


/*TAB ACTIVE */
setActiveTab(tab: string) {
  this.activeTab = tab;
}

getDireccionByCedula(cedula: number): Direccion_AdministradorApp | undefined {
  // console.log("cedula ", cedula)
  // console.log("direcciones completas", this.direcciones_administrador)
  // console.log("direccion id es  ", this.direcciones_administrador.find(direccion => direccion.id_Admin))
  // console.log("cedula ", cedula)
  // console.log("direcciones find",  this.direcciones_administrador.find(direccion => direccion.id_Admin=== cedula))

  return this.direcciones_administrador.find(direccion => direccion.id_Admin === cedula);

}

    /*ADMINISTRADORES */
/*ADMINISTRADORES APP*/
// En el componente
private createNewAdmin(adminData: any, cedulaAdmin: number): void {
  let adminToAdd = this.buildAdminObject(adminData);
  let direccionToAdd = this.buildDireccionObject(adminData, cedulaAdmin);
  let telefonosToAdd = this.buildTelefonosArray(this.telefonos.value, cedulaAdmin);
  console.log()
  // Primero creamos el administrador
  this.adminAppService.createAdminApp(adminToAdd).subscribe({
      next: (adminResponse) => {
          console.log('Administrador creado:', adminResponse);
          // Una vez creado el administrador, creamos la dirección
          this.adminAppService.createDireccionesAdminApp(direccionToAdd).subscribe({
              next: (direccionResponse) => {
                  console.log('Dirección creada:', direccionResponse);
                  // Ahora creamos todos los teléfonos de una vez
                  console.log("telefonostoAdd ",telefonosToAdd)
                  console.log("telefonostoAdd.values  ", telefonosToAdd.values)


                    this.adminAppService.createTelefonosAdminApp(telefonosToAdd).subscribe({
                      next: (telefonosResponse) => {
                          console.log('Teléfonos creados:  ', telefonosResponse);
                          this.getAllTelefonos();
                          this.showSuccess('Administrador y datos relacionados creados correctamente');
                      },
                      error: (error) => {
                          console.error('Error al crear los teléfonos:', error);
                          this.handleError('Error al crear los teléfonos');
                      }
                  });


                // Resetear el formulario
                this.resetForm();

                // Actualizar todos los datos
                this.updateAllData();
              },
              error: (error) => {
                  console.error('Error al crear la dirección:', error);
                  this.handleError('Error al crear la dirección');
              }
          });
      },
      error: (error) => {
          console.error('Error al crear el administrador:', error);
          this.handleError('Error al crear el administrador');
      }
  });
}






private buildAdminObject(data: any): AdministradorApp {
  if (!data.cedula || isNaN(parseInt(data.cedula))) {
      throw new Error('Cédula inválida');
  }

  return {
      cedula: parseInt(data.cedula),
      usuario: data.usuario?.trim() || '',
      password: data.password?.trim() || '',
      nombre: data.nombre?.trim() || '',
      apellido1: data.apellido1?.trim() || '',
      apellido2: data.apellido2?.trim() || '',
      correo: null
  };
}

private buildDireccionObject(data: any, cedulaAdmin: number): Direccion_AdministradorApp {
  if (!cedulaAdmin || isNaN(cedulaAdmin)) {
      throw new Error('Cédula inválida para la dirección');
  }

  return {
      id_Admin: cedulaAdmin,
      provincia: data.provincia?.trim() || '',
      canton: data.canton?.trim() || '',
      distrito: data.distrito?.trim() || ''
  };
}

private buildTelefonosArray(telefonos: any[], cedulaAdmin: number): Telefono_AdminApp[] {
  if (!cedulaAdmin || isNaN(cedulaAdmin)) {
      throw new Error('Cédula inválida para los teléfonos');
  }

  return telefonos.map(tel => ({
      cedula_Admin: cedulaAdmin,
      telefono: tel.telefono?.trim() || ''
  }));
}


// Métodos de manejo de errores y éxito
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



  // API Update Methods

  private updateExistingAdmin(adminData: any): void {
    let cedula = parseInt(adminData.cedula);
    let adminToUpdate = this.buildAdminObject(adminData);
    let direccionToUpdate = this.buildDireccionObject(adminData, cedula);
    let telefonosToUpdate = this.buildTelefonosArray(this.telefonos.value, cedula);

    // Primero actualizamos el administrador
    this.adminAppService.updateAdminApp(adminToUpdate).subscribe({
        next: (adminResponse) => {
            console.log('Administrador actualizado:', adminResponse);
            // Luego actualizamos la dirección
            this.adminAppService.updateDireccionAdminApp(direccionToUpdate).subscribe({
                next: (direccionResponse) => {
                    console.log('Dirección actualizada:', direccionResponse);
                    // Finalmente actualizamos los teléfonos
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
            console.error('Error al actualizar el administrador:', error);
            this.handleError('Error al actualizar el administrador');
        }
    });
}

private updateTelefonos(cedula: number, telefonos: Telefono_AdminApp[]): void {
  this.adminAppService.putTelefonosAdminApp(cedula, telefonos).subscribe({
    next: (response) => {
      console.log('Teléfonos actualizados:', response);
      // Actualizar explícitamente la lista de teléfonos
      this.adminAppService.getAllTelefonosAdminApp().subscribe({
        next: (telefonos) => {
          this.telefonos_admin = telefonos;
          this.showSuccess('Administrador y datos relacionados actualizados correctamente');
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


  // Método de eliminación mejorado
deleteallInfoAdmin(cedula: number): void {
  Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará toda la información del administrador y no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
  }).then((result) => {
      if (result.isConfirmed) {
          // Primero eliminamos los teléfonos
          this.adminAppService.deleteTelefonosAdminApp(cedula).subscribe({
              next: () => {
                  // Luego eliminamos la dirección
                  this.adminAppService.deleteDireccionesAdminApp(cedula).subscribe({
                      next: () => {
                          // Finalmente eliminamos el administrador
                          this.adminAppService.deleteAdminApp(cedula).subscribe({
                              next: () => {
                                  this.handleDeleteSuccess();
                              },
                              error: (error) => {
                                  console.error('Error al eliminar administrador:', error);
                                  this.handleDeleteError('administrador');
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


saveAdmin(): void {
  if (this.adminForm.valid) {
      Swal.fire({
          title: '¿Estás seguro?',
          text: this.editMode ? 'Se actualizará la información del administrador de la app' : 'Se creará un nuevo administrador de la app',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              let adminData = this.adminForm.value;
              let cedulaAdmin = parseInt(adminData.cedula); // Asegurar que sea número

              if (!this.editMode) {
                  this.createNewAdmin(adminData, cedulaAdmin);
              } else {
                  this.updateExistingAdmin(adminData);
              }

              this.resetForm();

          }
      });
  } else {
      Swal.fire({
          title: 'Error',
          text: 'Por favor, complete todos los campos requeridos',
          icon: 'error'
      });
      //this.mostrarErroresFormulario();
  }
}


  editAdmin(cedula: number): void {
    this.editMode = true;
    this.setActiveTab("crear");
    console.log("cedula admin app ", cedula)
    this.loadAdminData(cedula);
  }

  private loadAdminData(cedula: number): void {
    this.loadAdminDetails(cedula);
    this.loadAdminDireccion(cedula);
    this.loadAdminTelefonos(cedula);
  }

  private loadAdminDetails(cedula: number): void {
    this.adminAppService.getOneAdminApp(cedula).subscribe({
      next: (adminData) => {
        this.patchAdminForm(adminData);
      },
      error: (error) => console.error('Error al obtener el administrador de app:', error)
    });
  }

  private loadAdminDireccion(cedula: number): void {
    this.adminAppService.getDireccionAdminApp(cedula).subscribe({
      next: (direccionData) => {
        console.log("direccion data del admin app", direccionData)
        this.patchDireccionForm(direccionData);
      },
      error: (error) => console.error('Error al obtener la dirección del administrador de app:', error)
    });
  }

  private loadAdminTelefonos(cedula: number): void {
    console.log("cedula ",cedula)
    this.adminAppService.getTelefonosAdminApp(cedula).subscribe({
      next: (telefonosData) => {
        this.updateTelefonosFormArray(telefonosData);
      },
      error: (error) => console.error('Error al obtener los teléfonos del administrador de app:', error)
    });
  }

  private patchAdminForm(adminData: AdministradorApp): void {
    this.adminForm.patchValue({
      usuario: adminData.usuario,
      password: adminData.password,
      cedula: adminData.cedula,
      nombre: adminData.nombre,
      apellido1: adminData.apellido1,
      apellido2: adminData.apellido2
    });
  }

  private patchDireccionForm(direccionData: Direccion_AdministradorApp): void {
    this.adminForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
    });
  }

  private updateTelefonosFormArray(telefonosData: Telefono_AdminApp[]): void {
    this.telefonosFormArray = this.adminForm.get('TelefonosAdmin') as FormArray;
    this.telefonosFormArray.clear();

    telefonosData.forEach((telefono) => {
      this.telefonosFormArray.push(this.fb.group({
        telefono: telefono.telefono
      }));
    });
  }


  // Proceso de eliminación de teléfonos
  private deleteTelefonosProcess(cedula: number): void {
    this.adminAppService.deleteTelefonosAdminApp(cedula).subscribe({
      next: () => {
        console.log('Teléfonos del administrador de app eliminados correctamente');
        this.deleteDireccionProcess(cedula);
      },
      error: (error) => {
        console.error('Error al eliminar los teléfonos del administrador de app:', error);
        this.handleDeleteError('teléfonos del administrador de app');
      }
    });
  }

  // Proceso de eliminación de dirección
  private deleteDireccionProcess(cedula: number): void {
    this.adminAppService.deleteDireccionesAdminApp(cedula).subscribe({
      next: () => {
        console.log('Dirección del administrador de app eliminada correctamente');
        this.deleteAdminProcess(cedula);
      },
      error: (error) => {
        console.error('Error al eliminar la dirección del administrador de app:', error);
        this.handleDeleteError('dirección del administrador de app');
      }
    });
  }

  // Proceso de eliminación del administrador
  private deleteAdminProcess(cedula: number): void {
    this.adminAppService.deleteAdminApp(cedula).subscribe({
      next: () => {
        console.log('Administrador de app eliminado correctamente');
        this.handleDeleteSuccess();
      },
      error: (error) => {
        console.error('Error al eliminar el administrador de app:', error);
        this.handleDeleteError('administrador de app');
      }
    });
  }

  private handleDeleteSuccess(): void {
    this.updateAllData();
    Swal.fire({
      title: 'Eliminado',
      text: 'El administrador de app ha sido eliminado correctamente',
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

  // Actualización de datos después de la eliminación
  private updateAllData(): void {
    // Usar forkJoin para asegurar que todas las llamadas se completen
  forkJoin({
    administradores: this.adminAppService.getAdminApps(),
    direcciones: this.adminAppService.getDireccionesAdminApp(),
    telefonos: this.adminAppService.getAllTelefonosAdminApp()
  }).subscribe({
    next: (data) => {
      this.administradores = data.administradores;
      this.direcciones_administrador = data.direcciones;
      this.telefonos_admin = data.telefonos;
    },
    error: (error) => {
      console.error('Error al actualizar los datos:', error);
      this.handleError('Error al actualizar la información');
    }
  });
}


// Reset del formulario
private resetForm(): void {
  this.adminForm.reset();
  this.telefonosFormArray.clear();
  this.telefonosFormArray.push(this.createTelefonoFormGroup()); // Agregar al menos un teléfono vacío
  this.editMode = false;
}

// Mostrar errores del formulario
mostrarErroresFormulario(): void {
  // Revisar errores en campos principales del administrador de app
  Object.keys(this.adminForm.controls).forEach(field => {
    let control = this.adminForm.get(field);
    if (control?.invalid) {
      console.log(`Error en el campo '${field}' del administrador de app:`, control.errors);
    }
  });

  // Revisar errores en teléfonos del administrador de app
  let telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
  telefonosArray.controls.forEach((control, index) => {
    if (control.invalid) {
      console.log(`Error en el teléfono #${index + 1} del administrador de app:`, control.errors);
    }
  });
}

// Manejo de errores de validación específicos
getErrorMessage(controlName: string): string {
  let control = this.adminForm.get(controlName);
  if (control?.hasError('required')) {
    return `El campo ${controlName} es requerido`;
  }
  // Puedes agregar más validaciones específicas aquí
  return '';
}

// Verificar si un control es inválido
isFieldInvalid(controlName: string): boolean {
  let control = this.adminForm.get(controlName);
  return control ? control.invalid && (control.dirty || control.touched) : false;
}

// Validar formulario completo
validateForm(): boolean {
  if (this.adminForm.invalid) {
    Object.keys(this.adminForm.controls).forEach(key => {
      let control = this.adminForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    return false;
  }
  return true;
}

// Limpiar datos específicos
clearFormData(): void {
  this.currentAdmin = null;
  this.currentAdminDireccion = null;
  this.resetForm();
}

// Cancelar edición
cancelEdit(): void {
  this.clearFormData();
  this.editMode = false;
  this.setActiveTab('crear');
}

// Verificar cambios sin guardar
hasUnsavedChanges(): boolean {
  return this.adminForm.dirty;
}

// Confirmar salida con cambios sin guardar
confirmDiscardChanges(): Promise<boolean> {
  if (this.hasUnsavedChanges()) {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: 'Hay cambios sin guardar en el administrador de app. ¿Deseas descartarlos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'No, continuar editando'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  return Promise.resolve(true);
}
}

















