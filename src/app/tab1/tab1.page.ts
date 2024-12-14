import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonButton, IonModal } from '@ionic/angular/standalone';
import { CardMesaComponent } from '../card-mesa/card-mesa.component';
import { Mesa } from '../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { ModalCrearMesaComponent } from '../modal-crear-mesa/modal-crear-mesa.component';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonContent,CardMesaComponent,NgFor, ModalCrearMesaComponent ],
  providers: [ModalController]
})
export class Tab1Page {
  mesas = () => this.database.getMesas();// Recupera las mesas desde la base de datos
  private currentModal: HTMLIonModalElement | null = null;
  message : string = '';


  /* items = [
    { imagen: 'assets/poolball1.png', inicio: '14:00', precio: '90' },
    { imagen: 'assets/poolball2.png', inicio: '15:30', precio: '120' },
    { imagen: 'assets/poolball3.png', inicio: '16:45', precio: '75' },
  ]; */
  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController, private database: DatabaseService) {}
  goToDetails(mesa: Mesa) {
    this.router.navigate(['detalles-mesa'], { relativeTo: this.route, queryParams: mesa });
  }
  async openModalCrearMesa(){
    await this.database.loadMesas(); // Cargar los números disponibles antes de abrir
    console.log("test: " + this.mesas)
    this.currentModal = await this.modalController.create({
      component: ModalCrearMesaComponent
    });
    await this.currentModal.present();
    const { data, role } = await this.currentModal.onWillDismiss();

    if (role === 'confirm') {
      
    }
    return this.currentModal;
  }
}
