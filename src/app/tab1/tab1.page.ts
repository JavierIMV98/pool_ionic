import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CardMesaComponent } from '../card-mesa/card-mesa.component';

import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,CardMesaComponent,NgFor ],
})
export class Tab1Page {
  items = [
    { imagen: 'assets/poolball1.png', inicio: '14:00', precio: '90' },
    { imagen: 'assets/poolball2.png', inicio: '15:30', precio: '120' },
    { imagen: 'assets/poolball3.png', inicio: '16:45', precio: '75' },
  ];
  constructor(private router: Router, private route: ActivatedRoute) {}
  goToDetails(item: any) {
    this.router.navigate(['detalles-mesa'], { relativeTo: this.route, queryParams: item });
  }
}
