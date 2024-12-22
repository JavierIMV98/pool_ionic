import { Component, Input, OnInit } from '@angular/core';
import { IonCard } from "@ionic/angular/standalone";

import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';


@Component({
  selector: 'app-card-cliente',
  templateUrl: './card-cliente.singleton.html',
  styleUrls: ['./card-cliente.singleton.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonCardContent,IonCard],
})
export class CardClienteSingleton  implements OnInit {
  @Input() nombre: string = '14:00';
  constructor() { }

  ngOnInit() {}

}
