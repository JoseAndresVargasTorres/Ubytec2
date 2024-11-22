import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../Services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      userType: ['cliente', [Validators.required]]
    });
  }

  // Método para guardar datos del usuario
  private saveUserData(userData: any, userType: string) {
    try {
      // Guardar en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.setItem('userType', userType);

      // Verificar que se guardó correctamente
      const savedData = localStorage.getItem('loggedInUser');
      if (!savedData) {
        throw new Error('Error al guardar datos de usuario');
      }

      console.log('Datos guardados correctamente:', {
        userData: JSON.parse(savedData),
        type: userType
      });
    } catch (error) {
      console.error('Error guardando datos:', error);
      throw new Error('Error al guardar datos de sesión');
    }
  }

  private handleError(error: any) {
    console.error('Error de autenticación:', error);
    this.loading = false;

    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: error?.message || 'Usuario o contraseña incorrectos'
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    try {
      this.loading = true;
      let { usuario, password, userType } = this.loginForm.value;

      switch (userType) {
        case 'admin':
          this.authService.loginAdmin(password, usuario).subscribe({
            next: (response) => {
              this.saveUserData(response, 'admin');
              Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente'
              }).then(() => {
                this.router.navigate(['/gestion-administradores']);
              });
            },
            error: this.handleError.bind(this),
            complete: () => this.loading = false
          });
          break;

        case 'cliente':
          this.authService.loginCliente(password, usuario).subscribe({
            next: (response) => {
              this.saveUserData(response, 'cliente');
              Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente'
              }).then(() => {
                this.router.navigate(['/perfil-cliente']);
              });
            },
            error: this.handleError.bind(this),
            complete: () => this.loading = false
          });
          break;

        case 'negocio':
          this.authService.loginNegocioAfiliado(password, usuario).subscribe({
            next: (response) => {
              this.saveUserData(response, 'negocio');
              Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente'
              }).then(() => {
                this.router.navigate(['/gestion-pedidos']);
              });
            },
            error: this.handleError.bind(this),
            complete: () => this.loading = false
          });
          break;

        default:
          throw new Error('Tipo de usuario no válido');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Getters para validación en el template
  get usuarioInvalid() {
    const control = this.loginForm.get('usuario');
    return control?.invalid && control?.touched;
  }

  get passwordInvalid() {
    const control = this.loginForm.get('password');
    return control?.invalid && control?.touched;
  }

  // Método para resetear el formulario
  resetForm() {
    this.loginForm.reset({
      usuario: '',
      password: '',
      userType: 'cliente'
    });
  }

  // Método para manejar cambios en el tipo de usuario
  onUserTypeChange() {
    // Resetear campos si es necesario
    this.loginForm.patchValue({
      usuario: '',
      password: ''
    });
  }
}
