import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-affiliate',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header-affiliate.component.html',
  styleUrl: './header-affiliate.component.css'
})
export class HeaderAffiliateComponent {
  affiliateName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías obtener el nombre del administrador desde un servicio
    // Por ahora usamos un valor de ejemplo
    this.affiliateName = 'Admin Usuario';
  }

  logout() {
    // Aquí implementarías la lógica de cierre de sesión
    localStorage.removeItem('adminToken');
    this.router.navigate(['/']);
  }
}
