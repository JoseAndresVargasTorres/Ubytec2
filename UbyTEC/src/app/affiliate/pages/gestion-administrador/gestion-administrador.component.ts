import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog'
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-gestion-administrador',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './gestion-administrador.component.html',
  styleUrl: './gestion-administrador.component.css'
})
export class GestionAdministradorComponent {
  phones: string[] = [''];

  constructor (private api: ApiService, private router:Router, private dialogRef: MatDialogRef<GestionAdministradorComponent>){}

  addPhone() {
    this.phones.push('');
  }

  // Function to remove a phone field by index
  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  submitAdmin(form: any) {
    this.dialogRef.close({data: form, phones: this.phones});
  }


}
