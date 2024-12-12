import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { CardMesaComponent } from '../card-mesa/card-mesa.component';

import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ModalCrearMesaComponent } from '../modal-crear-mesa/modal-crear-mesa.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent,CardMesaComponent,NgFor, ModalCrearMesaComponent ],
  providers: [ModalController]
})
export class Tab1Page {
  private currentModal: HTMLIonModalElement | null = null;
  message : string = '';



  items = [
    { imagen: 'assets/poolball1.png', inicio: '14:00', precio: '90' },
    { imagen: 'assets/poolball2.png', inicio: '15:30', precio: '120' },
    { imagen: 'assets/poolball3.png', inicio: '16:45', precio: '75' },
  ];
  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController) {}
  goToDetails(item: any) {
    this.router.navigate(['detalles-mesa'], { relativeTo: this.route, queryParams: item });
  }
  async openModalCrearMesa(){
    this.currentModal = await this.modalController.create({
      component: ModalCrearMesaComponent
    });
    await this.currentModal.present();
    const { data, role } = await this.currentModal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Mesa: ${data.mesa}, Hora: ${data.hora}, Precio: ${data.precio}`;
    }
    return this.currentModal;
  }
}
