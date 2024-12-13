import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { Mesa } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, NgFor],
})
export class Tab3Page {
  mesas = this.database.getMesas();

  numero:number;
  inicio:string;
  precio:number;
  constructor(private database: DatabaseService) {}

  async createMesa(){
    const nuevamesa: Mesa ={
      numero : this.numero, inicio: this.inicio, precio : this.precio, extras: 0
    } 
    await this.database.insertMesa(nuevamesa);
    this.numero = 0;
    this.precio = 0;
    this.inicio = "";
  }


}
