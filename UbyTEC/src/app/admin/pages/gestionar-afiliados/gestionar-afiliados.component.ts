import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Afiliado } from '../../interfaces/comercioafiliado/Afiliado';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Telefono_comercio } from '../../interfaces/comercioafiliado/Telefono_comercio';
import { CommonModule } from '@angular/common';
import { Tipo_Comercio } from '../../interfaces/tipocomercio/Tipo_Comercio';
import { Direccion_Comercio } from '../../interfaces/comercioafiliado/Direccion_Comercio';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminAppServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';
import { FilterPipe } from '../../pipes/filter.pipe';
import { AfiliadoService } from '../../services/ServicioAfiliadoAPI/afiliado.service';
import { TipoComercioService } from '../../services/ServicioTipoComercio/tipo-comercio.service';
import { PasswordService } from '../../services/ServicePassword/password.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestionar-afiliados',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [HttpClient,AfiliadoService,AdminAppServiceService,FilterPipe,TipoComercioService], // Add this line
  templateUrl: './gestionar-afiliados.component.html',
  styleUrls: ['./gestionar-afiliados.component.css']
})


export class GestionarAfiliadosComponent implements OnInit {
  // Formularios
  afiliadoForm!: FormGroup;
  adminForm!: FormGroup;

  // Estados de edición
  editMode: boolean = false;
  editModeAdmin: boolean = false;

  // Pestaña activa
  activeTab: string = 'crear-afiliado';

  // Arrays de FormArray para teléfonos
  telefonosAfiliadoArray!: FormArray;
  telefonosAdminArray!: FormArray;

  // Datos de Afiliados
  afiliados: Afiliado[] = [];
  direcciones_comercio: Direccion_Comercio[] = [];
  telefonos_comercio: Telefono_comercio[] = [];
  tipos_comercio: Tipo_Comercio[] = [];
  administradores: AdministradorApp[] = [];

  // Datos de Administradores
  administradoresApp: AdministradorApp[] = [];
  direcciones_administrador: Direccion_AdministradorApp[] = [];
  telefonos_admin: Telefono_AdminApp[] = [];

  constructor(
    private fb: FormBuilder,
    private afiliadoService: AfiliadoService,
    private adminAppService: AdminAppServiceService,
    private tipocomercioService:TipoComercioService,
    private passwordService: PasswordService  // Añade el servicio al constructor

  ) {
    this.initializeForms();
  }


    // Inicialización de formularios
private initializeForms() {
  // Inicializar formulario de afiliado
  this.afiliadoForm = this.fb.group({
      cedula_Juridica: ['', Validators.required],
      nombre: ['', Validators.required],
      id_Tipo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      sinpe: ['', Validators.required],
      cedula_Admin: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosComercio: this.fb.array([
          this.createTelefonoFormGroup()
      ])
  });

  this.telefonosAfiliadoArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;

  // Inicializar formulario de administrador
  this.adminForm = this.fb.group({
      usuario: ['', Validators.required],
      password: [{value: '', disabled: true}], // No requerido ya que se genera automáticamente
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]], // Agregamos el correo
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosAdmin: this.fb.array([
          this.createTelefonoFormGroup()
      ])
  });

  this.telefonosAdminArray = this.adminForm.get('TelefonosAdmin') as FormArray;
}

/*********************************************************GETTERS************************************ */
  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(){
    this.getAllAfiliadosData();
    this.getAllAdministradoresData();
    this.getAllTiposComercio();
  }


  getAllAfiliadosData(){
    this.getAllAfiliados();
    this.getAllDireccionesComercio();
    this.getAllTelefonosComercio();

  }

  getAllAdministradoresData(){
    this.getAllAdmins();
    this.getAllDireccionesAdmin();
    this.getAllTelefonosAdmin();


  }


  getAllAfiliados(){

    this.afiliadoService.getComercios().subscribe(
      (data: Afiliado[]) => {
        this.afiliados = data;
        console.log('Administradores App cargados:', this.afiliados);
      },
      error => {
        console.error('Error al cargar los administradores de app:', error);
      }
    );
  }

  getAllDireccionesComercio(){
    this.afiliadoService.getDireccionesComercio().subscribe(
      (data: Direccion_Comercio[]) => {
        this.direcciones_comercio = data;
        console.log('Administradores App cargados:', this.direcciones_comercio);
      },
      error => {
        console.error('Error al cargar los administradores de app:', error);
      }
    );

  }


  getAllTelefonosComercio(){

    this.afiliadoService.getTelefonosComercio().subscribe({
      next: (data: Telefono_comercio[]) => {
        this.telefonos_comercio = data;
        console.log('Teléfonos comercio cargados:', this.telefonos_comercio);
      },
      error: error => {
        console.error('Error al cargar los teléfonos:', error);
        this.handleError('Error al cargar los teléfonos del comercio');
      }
    });
  }


  getAllAdmins(){

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


  getAllDireccionesAdmin(){
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


  getAllTelefonosAdmin(){

    this.adminAppService.getAllTelefonosAdminApp().subscribe(
      (data: Telefono_AdminApp[]) => {
        this.telefonos_admin = data;
        console.log('Teléfonos cargados ADMIN:', this.telefonos_admin);
      },
      error => {
        console.error('Error al cargar los teléfonos administradores:', error);
      }
    );
  }



  getAllTiposComercio(){
    this.tipocomercioService.getTiposdeComercio().subscribe(
      (data: Tipo_Comercio[]) => {
        this.tipos_comercio = data;
        console.log('TIPOS DE COMERCIO CARGADOS:', this.tipos_comercio);
      },
      error => {
        console.error('Error al cargar los teléfonos administradores:', error);
      }
    );

  }



// Métodos auxiliares para los formularios
private createTelefonoFormGroup(): FormGroup {
  return this.fb.group({
      telefono: ['', [
          Validators.required,
           // Validación para números de 8 dígitos
      ]]
  });
}

// Métodos para manejar teléfonos del afiliado
addTelefonoAfiliado() {
  this.telefonosAfiliado.push(this.createTelefonoFormGroup());
}

removeTelefonoAfiliado(index: number) {
  if (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(index);
  }
}

// Métodos para manejar teléfonos del administrador
addTelefonoAdmin() {
  this.telefonosAdmin.push(this.createTelefonoFormGroup());
}

removeTelefonoAdmin(index: number) {
  if (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(index);
  }
}


// Getters para FormArrays
get telefonosAfiliado() {
  return this.afiliadoForm.get('TelefonosComercio') as FormArray;
}

get telefonosAdmin() {
  return this.adminForm.get('TelefonosAdmin') as FormArray;
}

  // Método para cambiar entre pestañas
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


// Getters para obtener datos específicos por ID
getDireccionComercioById(cedula_Juridica: string): Direccion_Comercio | undefined {
  return this.direcciones_comercio.find(dir => dir.id_Comercio === cedula_Juridica);
}

getDireccionAdminById(cedula: number): Direccion_AdministradorApp | undefined {
  return this.direcciones_administrador.find(dir => dir.id_Admin === cedula);
}

getTelefonosComercioById(cedula_Juridica: string): Telefono_comercio[] {
  if (!this.telefonos_comercio) {
    this.getAllTelefonosComercio();
    return [];
  }
  const telefonos = this.telefonos_comercio.filter(t => t.cedula_Comercio === cedula_Juridica);
  console.log(`Teléfonos para comercio ${cedula_Juridica}:`, telefonos);
  return telefonos;
}

getTelefonosAdminById(cedula: number): Telefono_AdminApp[] {
  return this.telefonos_admin.filter(tel => tel.cedula_Admin === cedula);
}

// Getter para obtener admin por cédula
getAdminByCedula(cedula_Admin: number): AdministradorApp | undefined {
  return this.administradores.find(admin => admin.cedula === cedula_Admin);
}



//Metodo Save que determina si se está modificando o creando

saveAfiliado():void {

  if (this.afiliadoForm.valid) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: this.editMode ? 'Se actualizará la información del Afiliado' : 'Se creará un nuevo Afiliado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let afiliadoData = this.afiliadoForm.value;
            let cedula_Juridica = afiliadoData.cedula_Juridica
            if (!this.editMode) {
                this.createNewAfiliado(afiliadoData);
            } else {
                this.updateExistingAfiliado(afiliadoData,cedula_Juridica);
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

private createNewAfiliado(afiliadoData: any): void {
  let afiliadoToAdd = this.buildAfiliadoObject(afiliadoData);
  console.log("afiliado to add", afiliadoToAdd)
  // Crear repartidor
  this.afiliadoService.createComercio(afiliadoToAdd).subscribe({
    next: (afiliadoResponse) => {
      console.log('Afiliado creado:', afiliadoResponse);

      // Crear dirección
      let direccionToAdd = this.buildDireccionComercioObject(afiliadoData);
      this.afiliadoService.createDireccionComercio(direccionToAdd).subscribe({
        next: (direccionResponse) => {
          console.log('Dirección creada:', direccionResponse);

          // Crear teléfonos
          let telefonosToAdd = this.buildTelefonosComercioArray(this.telefonosAfiliado.value, afiliadoResponse.cedula_Juridica);
          console.log("telefonos to add ", telefonosToAdd)

          this.createTelefonos(telefonosToAdd);

          // Mostrar mensaje de éxito
          this.showSuccess('afiliado creado exitosamente');
          this.resetAfiliadoForm();
          // Resetear el formulario
          this.resetForm();

          // Actualizar todos los datos
          this.updateAllData();
        },
        error: (error) => {
          console.error('Error al crear la dirección:', error);
          this.handleError('Error al crear la dirección');
        }
      })
    },
    error: (error) => {
      console.error('Error al crear el afiliado:', error);
      this.handleError('Error al crear el afiliado');
    }
  });
 }
// Métodos auxiliares para construir objetos
private buildAfiliadoObject(data: any): Afiliado {
  return {
      cedula_Juridica: data.cedula_Juridica,
      nombre: data.nombre,
      correo: data.correo,
      sinpe: data.sinpe,
      id_Tipo: data.id_Tipo,
      cedula_Admin: data.cedula_Admin
  };
}

private buildDireccionComercioObject(data: any, ): Direccion_Comercio {
  return {
      id_Comercio: data.cedula_Juridica,
      provincia: data.provincia,
      canton: data.canton,
      distrito: data.distrito
  };
}

private buildTelefonosComercioArray(telefonos: any[], cedulaJuridica: string): Telefono_comercio[] {
  return telefonos.map(tel => ({
      cedula_Comercio: cedulaJuridica,
      telefono: tel.telefono
  }));
}

// Métodos para manejar teléfonos
// Modificar el método createTelefonos
private createTelefonos(telefonos: Telefono_comercio[]): Promise<any> {
  return new Promise((resolve, reject) => {
    this.afiliadoService.createTelefonosComercio(telefonos).subscribe({
      next: (response) => {
        console.log('Teléfonos creados:', response);
        this.getAllTelefonosComercio(); // Actualizar la lista de teléfonos
        resolve(response);
      },
      error: (error) => {
        console.error('Error al crear teléfonos:', error);
        reject(error);
      }
    });
  });
}



editAfiliado(cedula_Juridica:string){
  this.editMode = true;
  this.editModeAdmin = false;

  this.setActiveTab("crear-afiliado");

  this.loadAfiliadoData(cedula_Juridica);


}
private loadAfiliadoData(cedula_Juridica: string): void {
  this.loadAfiliadoDetails(cedula_Juridica),
  this.loadAfiliadoDireccion(cedula_Juridica),
  this.loadAfiliadoTelefonos(cedula_Juridica)


}


private loadAfiliadoDetails(cedula_Juridica: string):void {
  this.afiliadoService.getComercio(cedula_Juridica).subscribe({
    next: (data) => {
        this.patchAfiliadoForm(data);
    },
    error: (error) => {
      console.error('Error al obtener la dirección:', error);
      this.handleError('Error al cargar la dirección del repartidor');
    }
});


}


private loadAfiliadoDireccion(cedula_Juridica: string): void {
  this.afiliadoService.getDireccionComercio(cedula_Juridica).subscribe({
    next: (direccionData) => {
      this.patchAfiliadoDireccionForm(direccionData);
    },
    error: (error) => {
      console.error('Error al obtener la dirección:', error);
      this.handleError('Error al cargar la dirección del AFILIADO');
    }
  });
}

private loadAfiliadoTelefonos(cedula_Juridica:string):void{
  console.log("Cedula juridica", cedula_Juridica)
  this.afiliadoService.getTelefonosDeComercio(cedula_Juridica).subscribe({
    next: (data) => {
        this.updateAfiliadoTelefonosArray(data);
    },
    error: (error) => {
      console.error('Error al obtener los telefonos:', error);
      this.handleError('Error al cargar los telefonos');
    }
});
}



private patchAfiliadoForm(afiliadoData: any): void {
  this.afiliadoForm.patchValue({
      cedula_Juridica: afiliadoData.cedula_Juridica,
      nombre: afiliadoData.nombre,
      correo: afiliadoData.correo,
      sinpe: afiliadoData.sinpe,
      id_Tipo: afiliadoData.id_Tipo,
      cedula_Admin: afiliadoData.cedula_Admin
  });
}

private patchAfiliadoDireccionForm(direccionData: Direccion_Comercio): void {
  this.afiliadoForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
  });
}

private updateAfiliadoTelefonosArray(telefonosData: Telefono_comercio[]): void {
  let telefonosArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
  telefonosArray.clear();

  telefonosData.forEach(telefono => {
      telefonosArray.push(this.fb.group({
          telefono: [telefono.telefono, Validators.required]
      }));
  });
}


// Método updateExistingRepartidor modificado para enviar actualizaciones por separado
private updateExistingAfiliado(afiliadoData: any, cedula_Juridica: string): void {
  let afiliadoToUpdate = this.buildAfiliadoObject(afiliadoData);
  let direccionafiliadoToUpdate = this.buildDireccionComercioObject(afiliadoData);
  let telefonosafiliadoToUpdate = this.buildTelefonosComercioArray(this.telefonosAfiliado.value,cedula_Juridica);

  forkJoin({
    afiliado: this.afiliadoService.updateComercio(afiliadoToUpdate),
    direccion: this.afiliadoService.updateDireccionComercio(direccionafiliadoToUpdate),
    telefonos: this.afiliadoService.updateTelefonosComercio(cedula_Juridica, telefonosafiliadoToUpdate)
  }).subscribe({
    next: (responses) => {
      console.log('Actualizaciones completadas:', responses);
      // Actualizar datos locales después de la actualización exitosa
      this.updateAllData();
      this.showSuccess('Afiliado actualizado correctamente');
      this.resetAfiliadoForm();
      this.resetForm();
    },
    error: (error) => {
      console.error('Error en la actualización:', error);
      this.handleError('Error al actualizar la información del afiliado');
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
    }
  });
}

private deleteDireccionProcess(cedula_Juridica: string): void {
  this.afiliadoService.deleteDireccionComercio(cedula_Juridica).subscribe({
    next: () => {
      console.log('Dirección eliminada');
    },
    error: (error) => {
      console.error('Error al eliminar dirección:', error);
      this.handleError('Error al eliminar la dirección');
    }
  });
}

private deleteTelefonosProcess(cedula_Juridica: string): void {
  this.afiliadoService.deleteTelefonoComercio(cedula_Juridica).subscribe({
    next: () => {
      console.log('Teléfonos eliminados');
    },
    error: (error) => {
      console.error('Error al eliminar teléfonos:', error);
      this.handleError('Error al eliminar los teléfonos');
    }
  });
}


deleteAfiliado(cedulaJuridica: string): void {
  Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará toda la información del afiliado y no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
  }).then((result) => {
      if (result.isConfirmed) {
          this.executeAfiliadoDeletion(cedulaJuridica);
      }
  });
}

private executeAfiliadoDeletion(cedulaJuridica: string): void {
  // Eliminar en orden: teléfonos -> dirección -> afiliado
  this.deleteTelefonosComercio(cedulaJuridica)
      .then(() => this.deleteDireccionComercio(cedulaJuridica))
      .then(() => this.deleteAfiliadoMain(cedulaJuridica))
      .then(() => {
          this.handleDeleteSuccess();
          this.loadAfiliadoDetails(cedulaJuridica);
      })
      .catch(error => {
        console.error('Error al eliminar teléfonos:', error);
        this.handleError('Error al eliminar los teléfonos')
      });
}

private deleteTelefonosComercio(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteComercio(cedula).subscribe({
          next: () => {
              console.log('Teléfonos del comercio eliminados');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteDireccionComercio(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteDireccionComercio(cedula).subscribe({
          next: () => {
              console.log('Dirección del comercio eliminada');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteAfiliadoMain(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteComercio(cedula).subscribe({
          next: () => {
              console.log('Afiliado eliminado');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}



/*************************************************************************ADMINISTRADORES*****************************************************  */



private createNewAdmin(adminData: any, cedulaAdmin: number): void {

  let password = this.generateRandomPassword();

  let adminToAdd = this.buildAdminObject(adminData,password);
  let direccionToAdd = this.buildDireccionObject(adminData, cedulaAdmin);
  let telefonosToAdd = this.buildTelefonosArray(this.telefonosAdmin.value, cedulaAdmin);
  console.log("admin a adherir", adminToAdd)
  // Primero creamos el administrador
  this.adminAppService.createAdminApp(adminToAdd).subscribe({
      next: (adminResponse) => {
          console.log('Administrador creado:', adminResponse);

          this.passwordService.sendPasswordByEmail(
            adminData.nombre,
            adminData.correo,
            password
          ).then(() => {
            console.log('Correo enviado exitosamente');
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
                          this.showSuccess('Administrador y datos relacionados creados correctamente');
                          this.resetAdminForm();
                          // Resetear el formulario
                          this.resetForm();

                          // Actualizar todos los datos
                          this.updateAllData();
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
          }).catch(emailError => {
            console.error('Error al enviar el correo:', emailError);
            this.handleError('El administrador fue creado pero hubo un error al enviar el correo');
          });
        },
        error: (error) => {
          console.error('Error al crear el administrador:', error);
          this.handleError('Error al crear el administrador');
        }
      });
    }


    private generateRandomPassword(): string {
      const length = 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      return password;
    }


private buildAdminObject(data: any, password:string): AdministradorApp {
  if (!data.cedula || isNaN(parseInt(data.cedula))) {
      throw new Error('Cédula inválida');
  }

  return {
      cedula: parseInt(data.cedula),
      usuario: data.usuario?.trim() || '',
      password: password?.trim() || '',
      nombre: data.nombre?.trim() || '',
      apellido1: data.apellido1?.trim() || '',
      apellido2: data.apellido2?.trim() || '',
      correo: data.correo
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



  // API Update Methods

  private updateExistingAdmin(adminData: any): void {
    let cedula = parseInt(adminData.cedula);
    let adminToUpdate = this.buildAdminObject(adminData,adminData.password);
    let direccionToUpdate = this.buildDireccionObject(adminData, cedula);
    let telefonosToUpdate = this.buildTelefonosArray(this.telefonosAdmin.value, cedula);

    if (this.editModeAdmin && !adminData.password) {
      this.handleError('La contraseña es requerida al actualizar un administrador');
      return;
    }
    // Primero actualizamos el administrador


    this.adminAppService.updateAdminApp(adminToUpdate).subscribe({
        next: (adminResponse) => {
            console.log('Administrador actualizado:', adminResponse);
            // Luego actualizamos la dirección
            this.adminAppService.updateDireccionAdminApp(direccionToUpdate).subscribe({
                next: (direccionResponse) => {
                    console.log('Dirección actualizada:', direccionResponse);
                    // Finalmente actualizamos los teléfonos

                    console.log("telefonos to update admin  ",this.telefonosAdmin.value )
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
          this.showSuccess('Administrador y datos relacionados actualizados correctamente');
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

              if (!this.editModeAdmin) {
                console.log("voy a create Admin");
                  this.createNewAdmin(adminData, cedulaAdmin);
              } else {
                console.log("voy a update Existing Admin")

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
    this.editModeAdmin = true; // Cambiado de editMode a editModeAdmin
    this.editMode = true;
    this.setActiveTab("crear-admin");
    console.log("cedula admin app ", cedula)
    let passwordControl = this.adminForm.get('password');
    passwordControl?.enable(); // Habilitar el control
    passwordControl?.setValidators([Validators.required]);
    passwordControl?.updateValueAndValidity();
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
        console.log("admin informacion",adminData)
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
        console.log("telefonos data", telefonosData)
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
      apellido2: adminData.apellido2,
      correo:adminData.correo
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
    this.telefonosAdminArray = this.adminForm.get('TelefonosAdmin') as FormArray;
    this.telefonosAdminArray.clear();

    telefonosData.forEach((telefono) => {
      this.telefonosAdminArray.push(this.fb.group({
        telefono: telefono.telefono
      }));
    });
  }







/****************************************************************************METODOS DE ERRORES Y RESETS */
  resetForm(): void {
     // Reset formulario de afiliado
  this.afiliadoForm.reset();
  while (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(this.telefonosAfiliado.length - 1);
  }
  this.telefonosAfiliado.at(0).reset();

  // Reset formulario de administrador
  this.adminForm.reset();
  while (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(this.telefonosAdmin.length - 1);
  }
  this.telefonosAdmin.at(0).reset();

  // Reset estados
  this.editMode = false;
  this.editModeAdmin = false;
    // Deshabilitar y limpiar validación del password
    let passwordControl = this.adminForm.get('password');
    passwordControl?.disable();
    passwordControl?.clearValidators();
    passwordControl?.updateValueAndValidity();
  }

  private updateAllData(): void {
    forkJoin({
      afiliados: this.afiliadoService.getComercios(),
      direcciones: this.afiliadoService.getDireccionesComercio(),
      telefonos: this.afiliadoService.getTelefonosComercio(),
      administradores: this.adminAppService.getAdminApps(),
      tiposComercio: this.tipocomercioService.getTiposdeComercio()
    }).subscribe({
      next: (data) => {
        this.afiliados = data.afiliados;
        this.direcciones_comercio = data.direcciones;
        this.telefonos_comercio = data.telefonos;
        this.administradores = data.administradores;
        this.tipos_comercio = data.tiposComercio;
        console.log('Datos actualizados:', {
          afiliados: this.afiliados,
          direcciones: this.direcciones_comercio,
          telefonos: this.telefonos_comercio
        });
      },
      error: (error) => {
        console.error('Error al actualizar los datos:', error);
        this.handleError('Error al actualizar la información');
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

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
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

  private handleError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error'
    });
  }

  canDeleteAdmin(cedula: number): boolean {
    let comerciosAsociados = this.afiliados.filter(
        afiliado => afiliado.cedula_Admin === cedula
    );
    return comerciosAsociados.length === 0;
  }
  deleteAdmin(cedula: number): void {
    // Verificar si el admin está asociado a algún comercio
    let comerciosAsociados = this.afiliados.filter(af => af.cedula_Admin === cedula);

    if (comerciosAsociados.length > 0) {
        Swal.fire({
            title: 'No se puede eliminar',
            text: 'Este administrador está asociado a uno o más comercios. Debe reasignar los comercios antes de eliminarlo.',
            icon: 'error'
        });
        return;
    }



}


getComerciosAsociados(cedulaAdmin: number): Afiliado[] {
  return this.afiliados.filter(afiliado => afiliado.cedula_Admin === cedulaAdmin);
}

private resetAfiliadoForm(): void {
  this.afiliadoForm.reset();
  while (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(this.telefonosAfiliado.length - 1);
  }
  this.telefonosAfiliado.at(0).reset();
  this.editMode = false;
}

// Reset específico para el formulario de administrador
private resetAdminForm(): void {
  this.adminForm.reset();
  while (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(this.telefonosAdmin.length - 1);
  }
  this.telefonosAdmin.at(0).reset();
  this.editModeAdmin = false;
}

}
