import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cliente } from '../../client/interfaces/allinterfaces';
import { Administrador } from '../../client/interfaces/allinterfaces';

interface UserSession {
  userType: string;
  userData: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api';
  private readonly USER_KEY = 'currentUser';
  private readonly TYPE_KEY = 'userType';

  constructor(private http: HttpClient) {}

  loginAdmin(password: string, usuario: string): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/Administrador/${password}/${usuario}`).pipe(
      map(response => {
        if (response) {
          this.setUserSession(response, 'admin');
          return response;
        }
        throw new Error('Credenciales inválidas');
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  loginCliente(password: string, usuario: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/Cliente/${password}/${usuario}`).pipe(
      map(response => {
        if (response) {
          // Almacenamos los datos del usuario
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          localStorage.setItem('userType', 'cliente');
          return response;
        }
        throw new Error('Credenciales inválidas');
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }

  loginNegocioAfiliado(password: string, usuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Administrador/AdministradorComercio/${password}/${usuario}`).pipe(
      map(response => {
        if (response) {
          this.setUserSession(response, 'negocio');
          return response;
        }
        throw new Error('Credenciales inválidas');
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  setUserSession(userData: any, userType: string) {
    const sessionData: UserSession = {
      userType,
      userData,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(sessionData));
    sessionStorage.setItem(this.TYPE_KEY, userType);
  }

 // Método para obtener el usuario actual
 getCurrentUser(): any {
  const userStr = localStorage.getItem('loggedInUser');
  return userStr ? JSON.parse(userStr) : null;
}

  getUserType(): string | null {
    return sessionStorage.getItem(this.TYPE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userType');
  }
  // Método para verificar si el usuario actual es un cliente
  isCliente(): boolean {
    return this.getUserType() === 'cliente';
  }

  // Obtener la cédula del usuario actual
  getCurrentUserCedula(): number | null {
    const user = this.getCurrentUser();
    if (user && user.userData) {
      return user.userData.cedula;
    }
    return null;
  }
}
