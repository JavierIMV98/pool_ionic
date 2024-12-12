import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';


@Component({
  selector: 'app-detalles-mesa',
  templateUrl: './detalles-mesa.component.html',
  styleUrls: ['./detalles-mesa.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent],

})
export class DetallesMesaComponent  implements OnInit {
  item: any;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.item = params; // Recibe los datos desde la URL
    });
  }

  ngOnInit() {}

}
