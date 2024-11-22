import { Injectable } from '@angular/core';
import { NgFor } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  public objects: any;
  public displayedColumns: string[] = [];

  constructor(){}
  /**
   * @brief se encarga de mostrar la tabla con los archivos
   * @param objects
   * @param columns
   * @returns void
   */
  showTable(objects: {[s: string]: any}[], columns: string[]) {
    this.objects = objects;
    this.displayedColumns = this.setColumns(columns);
  }

  /**
   * @Brief muestra las columnas necesarias
   * @param columns
   * @returns string[]
   */
  setColumns(columns: any){
    let newColumns: string[] = [];
    let keys = Object.keys(this.objects[0]);
    keys.forEach(key => {
        if(columns.includes(key)){
          newColumns.push(key);
        }
      })
    return newColumns;
  }
}