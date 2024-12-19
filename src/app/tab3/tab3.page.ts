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

  can_cobros: string = '';
  tot_cobros: string = '';

  constructor(private database: DatabaseService) {}
  
}
