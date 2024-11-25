import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { Observable } from 'rxjs';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';

@Injectable({
  providedIn: 'root'
})
export class AdminAppServiceService {
  private apiUrlAdminApp = 'https://ubyapi-1016717342490.us-central1.run.app/api/Administrador/';
  private apiUrlDireccion = 'https://ubyapi-1016717342490.us-central1.run.app/api/DireccionAdministrador/';
  private apiUrlTelefono = 'https://ubyapi-1016717342490.us-central1.run.app/api/TelefonoAdmin/'; // Cambiado a TelefonoAdmin

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // GETS
  getAdminApps(): Observable<AdministradorApp[]> {
    return this.http.get<AdministradorApp[]>(this.apiUrlAdminApp);
  }

  getOneAdminApp(cedula: number): Observable<AdministradorApp> {
    return this.http.get<AdministradorApp>(`${this.apiUrlAdminApp}${cedula}`);
  }

  getDireccionesAdminApp(): Observable<Direccion_AdministradorApp[]> {
    return this.http.get<Direccion_AdministradorApp[]>(this.apiUrlDireccion);
  }

  getDireccionAdminApp(cedula: number): Observable<Direccion_AdministradorApp> {
    return this.http.get<Direccion_AdministradorApp>(`${this.apiUrlDireccion}${cedula}`);
  }

  getAllTelefonosAdminApp(): Observable<Telefono_AdminApp[]> {
    return this.http.get<Telefono_AdminApp[]>(this.apiUrlTelefono);
  }

  getTelefonosAdminApp(cedula: number): Observable<Telefono_AdminApp[]> {
    return this.http.get<Telefono_AdminApp[]>(`${this.apiUrlTelefono}${cedula}`);
  }

  // POSTS
  createAdminApp(adminApp: AdministradorApp): Observable<AdministradorApp> {
    return this.http.post<AdministradorApp>(this.apiUrlAdminApp, adminApp, this.httpOptions);
  }

  createDireccionesAdminApp(direccion: Direccion_AdministradorApp): Observable<Direccion_AdministradorApp> {
    return this.http.post<Direccion_AdministradorApp>(this.apiUrlDireccion, direccion, this.httpOptions);
  }


  createTelefonosAdminApp(telefonos: Telefono_AdminApp[]): Observable<Telefono_AdminApp[]> {
    return this.http.post<Telefono_AdminApp[]>(`${this.apiUrlTelefono}`, telefonos, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
}

  // PUTS
  updateAdminApp(admin: AdministradorApp): Observable<AdministradorApp> {
    return this.http.put<AdministradorApp>(
      `${this.apiUrlAdminApp}${admin.cedula}`,
      admin,
      this.httpOptions
    );
  }

  updateDireccionAdminApp(direccion: Direccion_AdministradorApp): Observable<Direccion_AdministradorApp> {
    return this.http.put<Direccion_AdministradorApp>(
      `${this.apiUrlDireccion}${direccion.id_Admin}`,
      direccion,
      this.httpOptions
    );
  }

 // Actualizar teléfonos
 putTelefonosAdminApp(cedula: number, telefonos: Telefono_AdminApp[]): Observable<Telefono_AdminApp[]> {
  return this.http.put<Telefono_AdminApp[]>(`${this.apiUrlTelefono}${cedula}`, telefonos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  });
}
  // DELETES
  deleteAdminApp(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlAdminApp}${cedula}`, this.httpOptions);
  }

  deleteDireccionesAdminApp(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${cedula}`, this.httpOptions);
  }

  deleteTelefonosAdminApp(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlTelefono}${cedula}`, this.httpOptions);
  }
}
