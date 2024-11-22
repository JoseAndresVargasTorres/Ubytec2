import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit {
  adminName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías obtener el nombre del administrador desde un servicio
    // Por ahora usamos un valor de ejemplo
    this.adminName = 'Admin Usuario';
  }

  logout() {
    // Aquí implementarías la lógica de cierre de sesión
    localStorage.removeItem('adminToken');
    this.router.navigate(['/']);
  }
}

