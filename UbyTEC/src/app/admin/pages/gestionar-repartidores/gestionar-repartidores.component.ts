import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Repartidor } from '../../interfaces/repartidos/Repartidor';
import { Direccion_Repartidor } from '../../interfaces/repartidos/Direccion_Repartidor';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepartidorService } from '../../services/ServicioRepartidorAPI/repartidor.service';
import { Telefono_repartidor } from '../../interfaces/repartidos/Telefono_repartidor';
import Swal from 'sweetalert2';
import { PasswordService } from '../../services/ServicePassword/password.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestionar-repartidores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, HttpClientModule ,HeaderAdminComponent],
  providers: [RepartidorService,HttpClient],
  templateUrl: './gestionar-repartidores.component.html',
  styleUrl: './gestionar-repartidores.component.css'
})
export class GestionarRepartidoresComponent implements OnInit {


  repartidorForm!: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray: FormArray;
  currentRepartidor: Repartidor | null = null;
  currentRepartidorDireccion: Direccion_Repartidor | null = null;
  repartidores: Repartidor[] = [];
  direcciones_repartidor: Direccion_Repartidor[] = [];
  telefonos_repartidor: Telefono_repartidor[] = [];

  constructor(private fb: FormBuilder, private repartidorService: RepartidorService, private passwordService:PasswordService) {
    this.telefonosFormArray = this.fb.array([]);
    this.initForm();
  }


  private initForm(): void {
    this.repartidorForm = this.fb.group({
      id:['',Validators.required],
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      password:[{value: '', disabled: true}],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosRepartidor: this.fb.array([
        this.createTelefonoFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.getAllRepartidores();
    this.getAllDirecciones();
    this.getAllTelefonos();
  }

  // Métodos para obtener datos
  getAllRepartidores(): void {
    this.repartidorService.getRepartidores().subscribe({
      next: (data: Repartidor[]) => {
        this.repartidores = data;
        console.log('Repartidores cargados:', this.repartidores);
      },
      error: error => {
        console.error('Error al cargar los repartidores:', error);
        this.handleError('Error al cargar los repartidores');
      }
    });
  }

  getAllDirecciones(): void {
    this.repartidorService.getDireccionesRepartidor().subscribe({
      next: (data: Direccion_Repartidor[]) => {
        this.direcciones_repartidor = data;
        console.log('Direcciones cargadas:', this.direcciones_repartidor);
      },
      error: error => {
        console.error('Error al cargar las direcciones:', error);
        this.handleError('Error al cargar las direcciones');
      }
    });
  }

  getAllTelefonos(): void {
    this.repartidorService.getTelefonosRepartidor().subscribe({
      next: (data: Telefono_repartidor[]) => {
        this.telefonos_repartidor = data;
        console.log('Teléfonos cargados:', this.telefonos_repartidor);
      },
      error: error => {
        console.error('Error al cargar los teléfonos:', error);
        this.handleError('Error al cargar los teléfonos');
      }
    });
  }

  // Métodos para manejar teléfonos
  createTelefonoFormGroup(): FormGroup {
    return this.fb.group({
      telefono: ['', Validators.required]
    });
  }

  get telefonos() {
    return this.repartidorForm.get('TelefonosRepartidor') as FormArray;
  }

  addTelefonoRegister() {
    this.telefonos.push(this.createTelefonoFormGroup());
  }

  removeTelefonoRegister(index: number) {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // Método para cambiar entre pestañas
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getDireccionByid(id: number): Direccion_Repartidor | undefined {
    console.log('Buscando dirección para ID:', id);
    let direccion = this.direcciones_repartidor.find(d => d.id_Repartidor === id);
    console.log('Dirección encontrada:', direccion);
    return direccion;
  }

  getTelefonosByidRepartidor(id: number): Telefono_repartidor[] {
    if (!this.telefonos_repartidor) {
      this.getAllTelefonos();
      return [];
    }
    let telefonos = this.telefonos_repartidor.filter(t => t.cedula_Repartidor === id);
    console.log(`Teléfonos para repartidor ${id}:`, telefonos);
    return telefonos;
  }

// Métodos para crear y actualizar repartidores
saveRepartidor(): void {
  if (this.editMode && !this.repartidorForm.get('password')?.value) {
    Swal.fire({
      title: 'Error',
      text: 'La contraseña es requerida al actualizar un repartidor',
      icon: 'error'
    });
    return;
  }
  if (this.repartidorForm.valid) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: this.editMode ? 'Se actualizará la información del repartidor' : 'Se creará un nuevo repartidor',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let repartidorData = this.repartidorForm.value;
        console.log("edit mode", this.editMode)
        console.log("current repartidor ",this.currentRepartidor)
        console.log("current repartidor . id  ",this.currentRepartidor?.id )
        let idRepartidor = this.editMode ? this.currentRepartidor?.id : null;
        console.log("idRepartidor ", idRepartidor)

        if (!this.editMode) {
          this.createNewRepartidor(repartidorData);
        } else if (idRepartidor) {
          console.log("repartidor data", repartidorData)
          this.updateExistingRepartidor(repartidorData, idRepartidor);
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

private createNewRepartidor(repartidorData: any): void {
  // Generar contraseña aleatoria
  let password = this.repartidorService.generateRandomPassword();

  let repartidorToAdd = this.buildRepartidorObject(repartidorData, password);

  // Crear repartidor
  this.repartidorService.createRepartidor(repartidorToAdd).subscribe({
    next: (repartidorResponse) => {
      const direccionToAdd = this.buildDireccionObject(repartidorData, repartidorResponse.id);
      const telefonosToAdd = this.buildTelefonosArray(this.telefonos.value, repartidorResponse.id);

      forkJoin({
        direccion: this.repartidorService.createDireccionRepartidor(direccionToAdd),
        telefonos: this.repartidorService.createTelefonosRepartidor(telefonosToAdd),
        email: this.passwordService.sendPasswordByEmail(
          repartidorToAdd.nombre,
          repartidorToAdd.correo,
          password
        )
      }).subscribe({
        next: () => {
          this.updateAllData();
          this.showSuccess('Repartidor creado exitosamente');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al crear datos relacionados:', error);
          this.handleError('Error al crear información adicional del repartidor');
        }
      });
    },
    error: (error) => {
      console.error('Error al crear repartidor:', error);
      this.handleError('Error al crear el repartidor');
    }
  });
}

// Métodos auxiliares para construir objetos
private buildRepartidorObject(data: any, password: string): Repartidor {
  return {
    id: data.id || 0,
    usuario: data.usuario?.trim() || '',
    password: password || '', // Solo se usa en creación
    nombre: data.nombre?.trim() || '',
    apellido1: data.apellido1?.trim() || '',
    apellido2: data.apellido2?.trim() || '',
    correo: data.correo?.trim() || ''
  };
}

private buildDireccionObject(data: any, id_Repartidor: number): Direccion_Repartidor {
  return {
    id_Repartidor: id_Repartidor,
    provincia: data.provincia?.trim() || '',
    canton: data.canton?.trim() || '',
    distrito: data.distrito?.trim() || ''
  };
}

private buildTelefonosArray(telefonos: any[], id_Repartidor: number): Telefono_repartidor[] {
  return telefonos.map(tel => ({
    cedula_Repartidor: id_Repartidor,
    telefono: tel.telefono?.trim() || ''
  }));
}

// Métodos para manejar teléfonos
private createTelefonos(telefonos: Telefono_repartidor[]): void {
  console.log("telefonos ", telefonos)
  console.log("telefonos a crear values ", telefonos.values)
    this.repartidorService.createTelefonosRepartidor(telefonos).subscribe({
      next: (response) => console.log('Teléfonos creados:', response),
      error: (error) => console.error('Error al crear teléfono:', error)
    });
  }





// Método principal de edición
editRepartidor(id: number): void {
  this.editMode = true;
  this.setActiveTab("crear");

  let passwordControl = this.repartidorForm.get('password');
  passwordControl?.enable();
  passwordControl?.setValidators([Validators.required]);
  passwordControl?.updateValueAndValidity();
  this.loadRepartidorData(id);
}

// Método para cargar todos los datos del repartidor
private loadRepartidorData(id: number): void {
  this.loadRepartidorDetails(id);
  this.loadRepartidorDireccion(id);
  this.loadRepartidorTelefonos(id);
}

// Cargar detalles del repartidor
private loadRepartidorDetails(id: number): void {
  this.repartidorService.getRepartidor(id).subscribe({
    next: (repartidorData) => {
      this.currentRepartidor = repartidorData;
      this.patchRepartidorForm(repartidorData);
    },
    error: (error) => {
      console.error('Error al obtener el repartidor:', error);
      this.handleError('Error al cargar los datos del repartidor');
    }
  });
}

// Cargar dirección del repartidor
private loadRepartidorDireccion(id: number): void {
  this.repartidorService.getDireccionRepartidor(id).subscribe({
    next: (direccionData) => {
      this.patchDireccionForm(direccionData);
    },
    error: (error) => {
      console.error('Error al obtener la dirección:', error);
      this.handleError('Error al cargar la dirección del repartidor');
    }
  });
}

// Cargar teléfonos del repartidor
private loadRepartidorTelefonos(id: number): void {
  this.repartidorService.getTelefonosDeRepartidor(id).subscribe({
    next: (telefonosData) => {
      this.updateTelefonosFormArray(telefonosData);
    },
    error: (error) => {
      console.error('Error al obtener los teléfonos:', error);
      this.handleError('Error al cargar los teléfonos del repartidor');
    }
  });
}

// Actualizar el formulario con los datos del repartidor
private patchRepartidorForm(repartidorData: Repartidor): void {
  this.repartidorForm.patchValue({
    id: repartidorData.id,
    usuario: repartidorData.usuario,
    password: repartidorData.password,
    nombre: repartidorData.nombre,
    apellido1: repartidorData.apellido1,
    apellido2: repartidorData.apellido2,
    correo: repartidorData.correo
  });
}

// Actualizar el formulario con los datos de dirección
private patchDireccionForm(direccionData: Direccion_Repartidor): void {
  this.repartidorForm.patchValue({
    provincia: direccionData.provincia,
    canton: direccionData.canton,
    distrito: direccionData.distrito
  });
}

// Actualizar el array de teléfonos en el formulario
private updateTelefonosFormArray(telefonosData: Telefono_repartidor[]): void {
  let telefonosArray = this.repartidorForm.get('TelefonosRepartidor') as FormArray;
    telefonosArray.clear();

    if (telefonosData && telefonosData.length > 0) {
      telefonosData.forEach(telefono => {
        telefonosArray.push(this.fb.group({
          telefono: telefono.telefono
        }));
      });
    } else {
      telefonosArray.push(this.createTelefonoFormGroup());
    }
  }

// Método updateExistingRepartidor modificado para enviar actualizaciones por separado
private updateExistingRepartidor(repartidorData: any, id: number): void {
  let repartidorToUpdate = this.buildRepartidorObject(repartidorData,repartidorData.password);
  let direccionToUpdate = this.buildDireccionObject(repartidorData, id);
  let telefonosToUpdate = this.buildTelefonosArray(this.telefonos.value, id);

    forkJoin({
      repartidor: this.repartidorService.updateRepartidor(repartidorToUpdate),
      direccion: this.repartidorService.updateDireccionRepartidor(direccionToUpdate),
      telefonos: this.repartidorService.updateTelefonosRepartidor(id, telefonosToUpdate)
    }).subscribe({
      next: (responses) => {
        console.log('Actualizaciones completadas:', responses);
        this.updateAllData(); // Actualizar todos los datos después de las modificaciones
        this.showSuccess('Repartidor actualizado correctamente');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error en la actualización:', error);
        this.handleError('Error al actualizar la información del repartidor');
      }
    });
  }

// Métodos para eliminar repartidor y datos relacionados
deleteAllInfoRepartidor(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará toda la información del repartidor y no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteTelefonosProcess(id);
    }
  });
}

private deleteTelefonosProcess(id: number): void {
  this.repartidorService.deleteTelefonoRepartidor(id).subscribe({
    next: () => {
      console.log('Teléfonos eliminados');
      this.deleteDireccionProcess(id);
    },
    error: (error) => {
      console.error('Error al eliminar teléfonos:', error);
      this.handleError('Error al eliminar los teléfonos');
    }
  });
}

private deleteDireccionProcess(id: number): void {
  this.repartidorService.deleteDireccionRepartidor(id).subscribe({
    next: () => {
      console.log('Dirección eliminada');
      this.deleteRepartidorProcess(id);
    },
    error: (error) => {
      console.error('Error al eliminar dirección:', error);
      this.handleError('Error al eliminar la dirección');
    }
  });
}

private deleteRepartidorProcess(id: number): void {
  this.repartidorService.deleteRepartidor(id).subscribe({
    next: () => {
      this.showSuccess('Repartidor eliminado correctamente');
      this.updateAllData();
    },
    error: (error) => {
      console.error('Error al eliminar repartidor:', error);
      this.handleError('Error al eliminar el repartidor');
    }
  });
}

// Métodos de utilidad
private updateAllData(): void {
  forkJoin({
    repartidores: this.repartidorService.getRepartidores(),
    direcciones: this.repartidorService.getDireccionesRepartidor(),
    telefonos: this.repartidorService.getTelefonosRepartidor()
  }).subscribe({
    next: (data) => {
      this.repartidores = data.repartidores;
      this.direcciones_repartidor = data.direcciones;
      this.telefonos_repartidor = data.telefonos;
      console.log('Datos actualizados:', {
        repartidores: this.repartidores,
        direcciones: this.direcciones_repartidor,
        telefonos: this.telefonos_repartidor
      });
    },
    error: (error) => {
      console.error('Error al actualizar los datos:', error);
      this.handleError('Error al actualizar la información');
    }
  });
}

 resetForm(): void {
  this.repartidorForm.reset();
  this.telefonosFormArray.clear();
  this.telefonosFormArray.push(this.createTelefonoFormGroup());
  this.editMode = false;

  // Deshabilitar y limpiar validación del password
  let passwordControl = this.repartidorForm.get('password');
  passwordControl?.disable();
  passwordControl?.clearValidators();
  passwordControl?.updateValueAndValidity();
}



private showSuccess(message: string): void {
  Swal.fire({
    title: 'Éxito',
    text: message,
    icon: 'success'
  });
}

private handleError(message: string): void {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error'
  });
}





}
