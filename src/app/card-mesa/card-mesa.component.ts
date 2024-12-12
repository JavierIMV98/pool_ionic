import { Component, Input, OnInit } from '@angular/core';
import { IonCard } from "@ionic/angular/standalone";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';


@Component({
  selector: 'app-card-mesa',
  templateUrl: './card-mesa.component.html',
  styleUrls: ['./card-mesa.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonCardContent,IonCard],
})
export class CardMesaComponent  implements OnInit {
  @Input() imagen: string = 'assets/icon/poolball2.png'; // Imagen por defecto
  @Input() inicio: string = '14:00'; // Texto principal
  @Input() precio: string = '90'; // Texto secundario
  constructor() { }

  ngOnInit() {}

}
