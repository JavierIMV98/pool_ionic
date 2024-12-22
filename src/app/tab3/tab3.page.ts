import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { RegistroHistorial } from '../services/database.service';

import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent,FormsModule ,  NgFor],
})
export class Tab3Page {
  registros = () => this.database.getRegistros();

  can_cobros: number = 0;
  tot_cobros: number = 0;

  constructor(private database: DatabaseService) {}
  
  async borrarHisto(){
    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar el historial?`
    );
  
    if (!confirmar) {
      console.log('Eliminación cancelada por el usuario.');
      return; // Si el usuario cancela, no se realiza ninguna acción
    }
    await this.database.borrarHistorial();
    alert("Historial Eliminado")
    
  }
  async eliminar(number:number, ini:string, fin:string, tot:number){
    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar el registro?`
    );
    if (!confirmar) {
      console.log('Eliminación cancelada por el usuario.');
      return; // Si el usuario cancela, no se realiza ninguna acción
    }
    await this.database.deleteHistorial(number, ini, fin, tot);
    alert("Registro Eliminado")
  }
}
