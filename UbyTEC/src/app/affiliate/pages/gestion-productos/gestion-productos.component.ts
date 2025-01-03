import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { NgFor, NgIf } from '@angular/common';
import { TableService } from '../../../Services/Table/table.service';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../Services/auth/auth.service';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [HeaderAffiliateComponent, NgFor, NgIf, MatTableModule, ReactiveFormsModule],
  templateUrl: './gestion-productos.component.html',
  styleUrl: './gestion-productos.component.css'
})
export class GestionProductosComponent {
  ProductForm: FormGroup;
  productAdded: boolean = false;
  administratorID: string = '';
  columns = ['id', 'nombre', 'categoria', 'precio'];  // Definir las columnas a mostrar
  catOptions: string[] = ['Pizza', 'Sandwich', 'Sopa', 'Refresco', 'Gaseosa', 'Té', 'Café', 'Bowl', 'Crepa', 'Plato Fuerte', 'Postre', 'Ensalada'];
  selectedFile: File | null = null;
  product_id: number = 0;

  activeTab: string = 'crear';
  editMode: boolean = false;

  products: any[] = [];
  displayedColumns: string[] = [];

  constructor(private api: ApiService, private router:Router, private table_service: TableService, private fb: FormBuilder, private auth_service: AuthService){
    this.ProductForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];

    if (validFormats.includes(file.type)) {
      this.selectedFile = file;
      console.log('Selected valid file:', this.selectedFile);
    } else {
      this.selectedFile = null;
      alert('Por favor, seleccione un archivo en formato PNG o JPG.');
    }
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Método para manejar el envío del formulario
  submit(form: any) {
    //form.id = this.product_id;
    let cuerpo = JSON.stringify(form);  // Convertir el formulario a una cadena JSON
    console.log(cuerpo);
    if (this.editMode){
      this.api.putData('Producto', cuerpo).subscribe({
        next: res => { 
          this.productAdded = true; 
          this.refreshTable(); //refresca la tabla
        },error: err => { console.error(err) }  // Imprimir el error en caso de fallo
      });
    }else{  
      this.api.postData("Producto", cuerpo).subscribe({
        next: res => { 
          this.productAdded = true;
          const cuerpo_producto_comercio = { cedula_comercio: this.administratorID, id_Producto: form.id };
          this.api.postData("ProductoComercio", JSON.stringify(cuerpo_producto_comercio)).subscribe({
            next: res => {console.log(res)}
          ,error: err => {console.error(err)}
          });
          this.refreshTable();
        },error: err => { console.error(err) }  // Imprimir el error en caso de fallo
      });
    }
  }


  showProducts(productos_comercio: {cedula_Comercio: string, id_Producto: number}[]){

    const product_calls = productos_comercio.map((producto: any) => this.api.getData(`Producto/${producto.id_Producto}`));

    forkJoin(product_calls).subscribe({
      next: (res) => {
        this.table_service.showTable(res, this.columns);  // Mostrar la tabla con los datos y columnas definidos
        this.products = this.table_service.objects;  // Obtener objetos de la tabla desde el servicio
        this.displayedColumns = this.table_service.displayedColumns;  // Obtener columnas a mostrar desde el servicio},  // Imprimir la respuesta en caso de éxito
      }
    })
  }

  ngOnInit(){
    this.administratorID = this.auth_service.getCurrentBusiness();
    let data = this.api.getData(`ProductosComercio/${this.administratorID}`);
    data.subscribe({
      next: res => {
        this.showProducts(res);
      },error: err => {console.error(err) }  // Imprimir el error en caso de fallo
    });
  }
  
  editProduct(id: number){
    this.product_id = id;
    console.log(this.ProductForm);
    this.api.getData(`Producto/${this.product_id}`).subscribe({
      next: (product) => {
        console.log(product);
        this.ProductForm.patchValue({
          id: product.id,
          nombre: product.nombre,
          categoria: product.categoria,
          precio: product.precio
        });

        this.editMode = true;
        this.activeTab = 'crear';
      }
    })
  }

  deleteProduct(id: number){
    this.api.deleteData(`Producto/${id}`).subscribe({
      next: res => {
        this.api.deleteData(`ProductoComercio/${id}`).subscribe({
          next:res => {
            this.refreshTable()
          },error: err => {console.error(err)}
        });
      } ,error: err => {console.error(err)}
    });
  }

  refreshTable(){
    let data = this.api.getData(`ProductosComercio/${this.administratorID}`);
      data.subscribe({
        next: res => {
          this.showProducts(res);
        },error: err => {console.error(err) }  // Imprimir el error en caso de fallo
      });
  }

  cancelEdit(){
    this.editMode = false;
  }
}
