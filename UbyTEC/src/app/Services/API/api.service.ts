import { Injectable } from '@angular/core';  // Importar el decorador Injectable
import { HttpClient } from '@angular/common/http';  // Importar HttpClient para realizar solicitudes HTTP
import { HttpHeaders } from '@angular/common/http';  // Importar HttpHeaders para configurar encabezados
import { Observable } from 'rxjs';  // Importar Observable para manejar respuestas asíncronas

@Injectable({
  providedIn: 'root'  // Proveer este servicio a nivel raíz de la aplicación
})
export class ApiService {

  private apiUrl = 'https://ubyapi-1016717342490.us-central1.run.app/api'; // URL base del API
  //private apisearchUrl = 'http://localhost:5172/api/search?email='
  constructor(private http: HttpClient) { }  // Inyectar HttpClient en el constructor

  // Método para obtener datos mediante una solicitud GET
  getData(url: string): Observable<any> {
    //console.log(this.http.get(`${this.apiUrl}/${url}`))
    return this.http.get(`${this.apiUrl}/${url}`);  // Realizar la solicitud GET a la URL especificada
  }
  // searchData(url: string): Observable<any> {
  //   console.log(this.http.get(`${this.apiUrl}/${url}/`))
  //   return this.http.get(`${this.apiUrl}/${url}`);  // Realizar la solicitud GET a la URL especificada

  // }

  // Método para enviar datos mediante una solicitud POST
  postData(url: string, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${url}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados para indicar el tipo de contenido
    });
  }

  // Método para actualizar datos mediante una solicitud PUT
  putData(url: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${url}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados para indicar el tipo de contenido
    });
  }


  // Método para eliminar datos mediante una solicitud DELETE
  deleteData(url: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${url}`);  // Realizar la solicitud DELETE a la URL especificada
  }
}