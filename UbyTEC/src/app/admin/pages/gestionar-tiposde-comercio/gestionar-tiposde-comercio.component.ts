import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tipo_Comercio } from '../../interfaces/tipocomercio/Tipo_Comercio';
import { TipoComercioService } from '../../services/ServicioTipoComercio/tipo-comercio.service';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestionar-tiposde-comercio',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [HttpClient, TipoComercioService],
  templateUrl: './gestionar-tiposde-comercio.component.html',
  styleUrl: './gestionar-tiposde-comercio.component.css'
})
export class GestionarTiposdeComercioComponent implements OnInit {
  tipoComercioForm: FormGroup;
  tiposComercio: Tipo_Comercio[] = [];
  editMode: boolean = false;
  selectedTipoComercio: Tipo_Comercio | null = null;
  activeTab: string = 'crear';

  constructor(
    private fb: FormBuilder,
    private tipoComercioService: TipoComercioService
  ) {
    this.tipoComercioForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTiposComercio();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'crear' && !this.editMode) {
      this.resetForm();
    }
  }

  getAllTiposComercio(): void {
    this.tipoComercioService.getTiposdeComercio().subscribe({
      next: (data) => {
        this.tiposComercio = data;
      },
      error: (error) => {
        console.error('Error al cargar los tipos de comercio:', error);
        Swal.fire('Error', 'No se pudieron cargar los tipos de comercio', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.tipoComercioForm.valid) {
      if (this.editMode && this.selectedTipoComercio) {
        this.updateTipoComercio();
      } else {
        this.createTipoComercio();
      }
    } else {
      this.validateForm();
    }
  }

  createTipoComercio(): void {
    let tipoComercio: Tipo_Comercio = this.tipoComercioForm.value;
    this.tipoComercioService.createTipoComercio(tipoComercio).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Tipo de comercio creado correctamente', 'success');
        this.resetForm();
        this.getAllTiposComercio();
        this.setActiveTab('lista');
      },
      error: (error) => {
        console.error('Error al crear el tipo de comercio:', error);
        Swal.fire('Error', 'No se pudo crear el tipo de comercio', 'error');
      }
    });
  }

  editTipoComercio(tipoComercio: Tipo_Comercio): void {
    this.editMode = true;
    this.selectedTipoComercio = tipoComercio;
    this.tipoComercioForm.patchValue({
      nombre: tipoComercio.nombre
    });
    this.setActiveTab('crear');  // Cambia a la pestaña de crear/modificar
  }

  updateTipoComercio(): void {
    if (this.selectedTipoComercio) {
      let tipoComercio: Tipo_Comercio = {
        id: this.selectedTipoComercio.id,
        nombre: this.tipoComercioForm.get('nombre')?.value
      };

      this.tipoComercioService.updateTipoComercio(tipoComercio.id, tipoComercio).subscribe({
        next: (data) => {
          Swal.fire('Éxito', 'Tipo de comercio actualizado correctamente', 'success');
          this.resetForm();
          this.getAllTiposComercio();
          this.setActiveTab('lista');
        },
        error: (error) => {
          console.error('Error al actualizar el tipo de comercio:', error);
          Swal.fire('Error', 'No se pudo actualizar el tipo de comercio', 'error');
        }
      });
    }
  }

  deleteTipoComercio(tipoComercio: Tipo_Comercio): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el tipo de comercio y no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoComercioService.deleteTipoComercio(tipoComercio.id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Tipo de comercio eliminado correctamente', 'success');
            this.getAllTiposComercio();
          },
          error: (error) => {
            console.error('Error al eliminar el tipo de comercio:', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de comercio', 'error');
          }
        });
      }
    });
  }

  resetForm(): void {
    this.tipoComercioForm.reset();
    this.editMode = false;
    this.selectedTipoComercio = null;
  }

  validateForm(): void {
    Object.keys(this.tipoComercioForm.controls).forEach((key) => {
      let control = this.tipoComercioForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string): string {
    let control = this.tipoComercioForm.get(controlName);
    if (control?.hasError('required')) {
      return `El campo ${controlName} es requerido`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    let control = this.tipoComercioForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
