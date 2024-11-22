import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repartidor } from '../../interfaces/repartidos/Repartidor';
import { Direccion_Repartidor } from '../../interfaces/repartidos/Direccion_Repartidor';
import { Telefono_repartidor } from '../../interfaces/repartidos/Telefono_repartidor';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  private baseUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api';

  constructor(private http: HttpClient) { }

  // Métodos para Repartidor
  getRepartidores(): Observable<Repartidor[]> {
    return this.http.get<Repartidor[]>(`${this.baseUrl}/Repartidor`);
  }

  getRepartidor(id: number): Observable<Repartidor> {
    return this.http.get<Repartidor>(`${this.baseUrl}/Repartidor/${id}`);
  }

  createRepartidor(repartidor: Repartidor): Observable<Repartidor> {
    return this.http.post<Repartidor>(`${this.baseUrl}/Repartidor`, repartidor);
  }

  updateRepartidor(repartidor: Repartidor): Observable<Repartidor> {
    return this.http.put<Repartidor>(`${this.baseUrl}/Repartidor/${repartidor.id}`, repartidor);
  }

  deleteRepartidor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Repartidor/${id}`);
  }

  // Métodos para Dirección
  getDireccionesRepartidor(): Observable<Direccion_Repartidor[]> {
    return this.http.get<Direccion_Repartidor[]>(`${this.baseUrl}/DireccionRepartidor`);
  }

  getDireccionRepartidor(id: number): Observable<Direccion_Repartidor> {
    return this.http.get<Direccion_Repartidor>(
      `${this.baseUrl}/DireccionRepartidor/${id}`
    );
  }

  createDireccionRepartidor(direccion: Direccion_Repartidor): Observable<Direccion_Repartidor> {
    return this.http.post<Direccion_Repartidor>(`${this.baseUrl}/DireccionRepartidor`, direccion);
  }

  updateDireccionRepartidor(direccion: Direccion_Repartidor): Observable<Direccion_Repartidor> {
    return this.http.put<Direccion_Repartidor>(`${this.baseUrl}/DireccionRepartidor/${direccion.id_Repartidor}`, direccion);
  }

  deleteDireccionRepartidor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DireccionRepartidor/${id}`);
  }

  // Métodos para Teléfono
  getTelefonosRepartidor(): Observable<Telefono_repartidor[]> {
    return this.http.get<Telefono_repartidor[]>(`${this.baseUrl}/TelefonoRepartidor`);
  }

  getTelefonosDeRepartidor(id: number): Observable<Telefono_repartidor[]> {
    return this.http.get<Telefono_repartidor[]>(
      `${this.baseUrl}/TelefonoRepartidor/${id}`
    );
  }
  createTelefonosRepartidor(telefonos: Telefono_repartidor[]): Observable<Telefono_repartidor[]> {
    return this.http.post<Telefono_repartidor[]>(
        `${this.baseUrl}/TelefonoRepartidor`,
        telefonos,  // Enviar el array completo
    );
}

  updateTelefonosRepartidor(id: number, telefonos: Telefono_repartidor[]): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/TelefonoRepartidor/${id}`,
      telefonos,
    );
  }


  deleteTelefonoRepartidor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/TelefonoRepartidor/${id}`);
  }

  // Método para generar contraseña aleatoria
  generateRandomPassword(): string {
    let length = 12;
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  // Método para enviar contraseña por email
  sendPasswordByEmail(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Email/SendPassword`, { email, password });
  }
}
