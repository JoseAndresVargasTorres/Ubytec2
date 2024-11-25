import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tipo_Comercio } from '../../interfaces/tipocomercio/Tipo_Comercio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoComercioService {

  constructor(private http: HttpClient) { }

  private apiUrltipoComercio =  'http://localhost:5037/api/TipoComercio/';;

   // Obtener todos los tipos de comercio
   getTiposdeComercio(): Observable<Tipo_Comercio[]> {
    return this.http.get<Tipo_Comercio[]>(this.apiUrltipoComercio);
  }

  // Obtener un tipo de comercio por ID
  getTipoComercio(id: number): Observable<Tipo_Comercio> {
    return this.http.get<Tipo_Comercio>(`${this.apiUrltipoComercio}${id}`);
  }

  // Crear un nuevo tipo de comercio
  createTipoComercio(tipoComercio: Tipo_Comercio): Observable<Tipo_Comercio> {
    return this.http.post<Tipo_Comercio>(this.apiUrltipoComercio, tipoComercio);
  }

  // Actualizar un tipo de comercio
  updateTipoComercio(id: number, tipoComercio: Tipo_Comercio): Observable<Tipo_Comercio> {
    return this.http.put<Tipo_Comercio>(`${this.apiUrltipoComercio}${id}`, tipoComercio);
  }

  // Eliminar un tipo de comercio
  deleteTipoComercio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrltipoComercio}${id}`);
  }



}
