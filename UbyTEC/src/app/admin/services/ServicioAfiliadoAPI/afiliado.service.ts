import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Afiliado } from '../../interfaces/comercioafiliado/Afiliado';
import { Direccion_Comercio } from '../../interfaces/comercioafiliado/Direccion_Comercio';
import { Telefono_comercio } from '../../interfaces/comercioafiliado/Telefono_comercio';
import { ValidacionComercioControllerSQL } from '../../../client/interfaces/allinterfaces';
import { Tipo_Comercio } from '../../interfaces/tipocomercio/Tipo_Comercio';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';

/**
 * Servicio para gestionar las operaciones CRUD de Comercios y sus datos relacionados
 * @Injectable indica que este servicio puede ser inyectado en otros componentes/servicios
 */
@Injectable({
  providedIn: 'root' // El servicio está disponible en toda la aplicación
})
export class AfiliadoService {
  // URLs base para los diferentes endpoints de la API

  private apiUrlComercio = 'https://ubyapi-1016717342490.us-central1.run.app/api/ComercioAfiliado/';
  private apiUrlDireccion = 'https://ubyapi-1016717342490.us-central1.run.app/api/DireccionComercio/';
  private apiUrlTelefono = 'https://ubyapi-1016717342490.us-central1.run.app/api/TelefonoComercio/';
  private apiUrlTipoComercio = 'https://ubyapi-1016717342490.us-central1.run.app/api/TipoComercio/';
  private apiUrlValidacionComercio = 'https://ubyapi-1016717342490.us-central1.run.app/api/ValidacionComercioContrllerSQL/';

  constructor(private http: HttpClient) {} // Inyección del servicio HttpClient

  // Métodos para Comercio
  getComercios(): Observable<Afiliado[]> {
    return this.http.get<Afiliado[]>(`${this.apiUrlComercio}`);
  }

  getComercio(id: string): Observable<Afiliado> {
    return this.http.get<Afiliado>(`${this.apiUrlComercio}${id}`);
  }

  createComercio(comercio: Afiliado): Observable<Afiliado> {
    return this.http.post<Afiliado>(`${this.apiUrlComercio}`, comercio);
  }

  updateComercio(comercio: Afiliado): Observable<Afiliado> {
    return this.http.put<Afiliado>(`${this.apiUrlComercio}${comercio.cedula_Juridica}`, comercio);
  }

  deleteComercio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlComercio}${id}`);
  }

  // Métodos para Dirección de Comercio
  getDireccionesComercio(): Observable<Direccion_Comercio[]> {
    return this.http.get<Direccion_Comercio[]>(`${this.apiUrlDireccion}`);
  }

  getDireccionComercio(id: string): Observable<Direccion_Comercio> {
    return this.http.get<Direccion_Comercio>(
      `${this.apiUrlDireccion}${id}`
    );
  }

  createDireccionComercio(direccion: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.post<Direccion_Comercio>(`${this.apiUrlDireccion}`, direccion);
  }

  updateDireccionComercio(direccion: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.put<Direccion_Comercio>(`${this.apiUrlDireccion}${direccion.id_Comercio}`, direccion);
  }

  deleteDireccionComercio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${id}`);
  }

  // Métodos para Teléfono de Comercio
  getTelefonosComercio(): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(`${this.apiUrlTelefono}`);
  }

  getTelefonosDeComercio(id: string): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(
      `${this.apiUrlTelefono}${id}`
    );
  }

  createTelefonosComercio(telefonos: Telefono_comercio[]): Observable<Telefono_comercio[]> {
    return this.http.post<Telefono_comercio[]>(
      `${this.apiUrlTelefono}`,
      telefonos  // Enviar el array completo
    );
  }

  updateTelefonosComercio(id: string, telefonos: Telefono_comercio[]): Observable<any> {
    return this.http.put(
      `${this.apiUrlTelefono}${id}`,
      telefonos
    );
  }

  deleteTelefonoComercio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlTelefono}${id}`);
  }

  // Métodos para Validacion de Comercio
  getValidacionComercio(): Observable<ValidacionComercioControllerSQL[]> {
    return this.http.get<ValidacionComercioControllerSQL[]>(`${this.apiUrlValidacionComercio}`);
  }

  getValidacionDeComercio(id: string): Observable<ValidacionComercioControllerSQL> {
    return this.http.get<ValidacionComercioControllerSQL>(
      `${this.apiUrlValidacionComercio}${id}`
    );
  }

  createValidacionComercio(validacion: ValidacionComercioControllerSQL): Observable<ValidacionComercioControllerSQL> {
    return this.http.post<ValidacionComercioControllerSQL>(
      `${this.apiUrlTelefono}`, validacion  // Enviar el array completo
    );
  }

  updateValidacionComercioComercio(id: string, validacion: ValidacionComercioControllerSQL): Observable<any> {
    return this.http.put(
      `${this.apiUrlValidacionComercio}${id}`,
      validacion
    );
  }

  deleteValidacionComercio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlValidacionComercio}${id}`);
  }


}
