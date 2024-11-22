import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/API/api.service';
import { TableService } from '../../../Services/Table/table.service';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { ReciboComponent } from '../recibo/recibo.component';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [MatTableModule, CommonModule,HeaderAffiliateComponent],
  templateUrl: './gestion-pedidos.component.html',
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent {
  objects: any[] = [];  // Array para almacenar objetos
  displayedColumns: string[] = [];  // Array para almacenar las columnas a mostrar en la tabla
  
  constructor(private table_service: TableService, private router:Router, private api: ApiService, private dialog: MatDialog){}

  ngOnInit(): void {
    
    const columns = ['num_Pedido', 'nombre', 'estado', 'monto_Total', 'id_Repartidor', 'cedula_Comercio'];  // Definir las columnas a mostrar
    let data = this.api.getData('Pedido/');
    data.subscribe({
      next: res => {
        const objetosPropios = res.filter((pedido: any) => pedido.cedula_Comercio === "3101234567");
        this.table_service.showTable(objetosPropios, columns);  // Mostrar la tabla con los datos y columnas definidos
        this.objects = this.table_service.objects;  // Obtener objetos de la tabla desde el servicio
        this.displayedColumns = this.table_service.displayedColumns;  // Obtener columnas a mostrar desde el servicio},  // Imprimir la respuesta en caso de éxito
      },error: err => {console.error(err) }  // Imprimir el error en caso de fallo
    });

  }

  onButtonClick(element: any): void {
    //
  }

  openAdminDialog(id: number) {
    const dialogRef = this.dialog.open(ReciboComponent, {
      data: { id: id },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.adminAdded = true; // Set the indicator on success
      }
    });
  }
  

}
