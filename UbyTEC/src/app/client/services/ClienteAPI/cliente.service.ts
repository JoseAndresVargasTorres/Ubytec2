import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../../interfaces/allinterfaces';
import { DireccionCliente } from '../../interfaces/allinterfaces';
import { TelefonoCliente } from '../../interfaces/allinterfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrlCliente = 'https://ubyapi-1016717342490.us-central1.run.app/api/Cliente/';
  private apiUrlDireccion = 'https://ubyapi-1016717342490.us-central1.run.app/api/DireccionCliente/';
  private apiUrlTelefono = 'https://ubyapi-1016717342490.us-central1.run.app/api/TelefonoCliente/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // GETS
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrlCliente);
  }

  getOneCliente(cedula: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrlCliente}${cedula}`);
  }

  getDireccionesCliente(): Observable<DireccionCliente[]> {
    return this.http.get<DireccionCliente[]>(this.apiUrlDireccion);
  }

  getDireccionCliente(cedula: number): Observable<DireccionCliente> {
    return this.http.get<DireccionCliente>(`${this.apiUrlDireccion}${cedula}`);
  }

  getAllTelefonosCliente(): Observable<TelefonoCliente[]> {
    return this.http.get<TelefonoCliente[]>(this.apiUrlTelefono);
  }

  getTelefonosCliente(cedula: number): Observable<TelefonoCliente[]> {
    return this.http.get<TelefonoCliente[]>(`${this.apiUrlTelefono}${cedula}`);
  }

  // POSTS
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrlCliente, cliente, this.httpOptions);
  }

  createDireccionCliente(direccion: DireccionCliente): Observable<DireccionCliente> {
    return this.http.post<DireccionCliente>(this.apiUrlDireccion, direccion, this.httpOptions);
  }

  createTelefonosCliente(telefonos: TelefonoCliente[]): Observable<TelefonoCliente[]> {
    return this.http.post<TelefonoCliente[]>(`${this.apiUrlTelefono}`, telefonos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // PUTS
  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrlCliente}${cliente.cedula}`,
      cliente,
      this.httpOptions
    );
  }

  updateDireccionCliente(direccion: DireccionCliente): Observable<DireccionCliente> {
    return this.http.put<DireccionCliente>(
      `${this.apiUrlDireccion}${direccion.id_Cliente}`,
      direccion,
      this.httpOptions
    );
  }

  putTelefonosCliente(cedula: number, telefonos: TelefonoCliente[]): Observable<TelefonoCliente[]> {
    return this.http.put<TelefonoCliente[]>(`${this.apiUrlTelefono}${cedula}`, telefonos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // DELETES
  deleteCliente(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlCliente}${cedula}`, this.httpOptions);
  }

  deleteDireccionCliente(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${cedula}`, this.httpOptions);
  }

  deleteTelefonosCliente(cedula: number): Observable<any> {
    return this.http.delete(`${this.apiUrlTelefono}${cedula}`, this.httpOptions);
  }
}
