// header-client.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-client',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header-client.component.html',
  styleUrl: './header-client.component.css'
})
export class HeaderClientComponent implements OnInit {
  clientName: string = '';
  cartItemCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías obtener el nombre del cliente desde un servicio
    this.clientName = 'Cliente Usuario';

    // Aquí podrías suscribirte a un servicio de carrito para mantener actualizado el contador
    this.updateCartItemCount();
  }

  updateCartItemCount() {
    // Aquí implementarías la lógica para obtener la cantidad de items en el carrito
    // Por ahora usamos un valor de ejemplo
    this.cartItemCount = 0;
  }

  logout() {
    // Aquí implementarías la lógica de cierre de sesión
    localStorage.removeItem('ClienteToken');
    this.router.navigate(['/']);
  }
}
