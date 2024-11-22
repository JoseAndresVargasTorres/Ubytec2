import { Component, OnInit, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/API/api.service';
import { TableService } from '../../../Services/Table/table.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { GestionPedidosComponent } from '../gestion-pedidos/gestion-pedidos.component';

@Component({
  selector: 'app-recibo',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.css'
})
export class ReciboComponent {
  displayedColumns: string[] = [];  // Array para almacenar las columnas a mostrar en la tabla
  prices: number[] = [];
  productos: any[] = [];
  
  constructor(private table_service: TableService, private dialogRef: MatDialogRef<GestionPedidosComponent>, private router:Router, private api: ApiService, @Inject(MAT_DIALOG_DATA) public data: { id: string }){}

  ngOnInit(): void {
    
    const columns = ['nombre', 'precio'];  // Definir las columnas a mostrar
    let pedido = this.api.getData('ProductosPedidos/' + this.data.id);
    pedido.subscribe({
      next: (res: Array<{ num_Pedido: number; id_Producto: number }>) => {
        const apiCalls = res.map(item => this.getProduct(item));
        forkJoin(apiCalls).subscribe({
          next: products=> {
            console.log(products);
            this.table_service.showTable(products, columns);  // Mostrar la tabla con los datos y columnas definidos
          },error: err => {console.error(err)}
        });

        this.productos = this.table_service.objects;  // Obtener objetos de la tabla desde el servicio
        this.displayedColumns = this.table_service.displayedColumns;  // Obtener columnas a mostrar desde el servicio}
        
      },error: err => {console.error(err) }  // Imprimir el error en caso de fallo
    });

  }

  onButtonClick(): void {
    this.api.putData(`Pedido/AsignaRepartidor/${this.data.id}`, {}).subscribe({
      next: res => {
        console.log(res);
      }, error: err => { console.error(err)}
    });
    this.dialogRef.close();
  }

  getProduct(pedido: any){
    return this.api.getData('Producto/' + pedido.id_Producto);
  }


}
