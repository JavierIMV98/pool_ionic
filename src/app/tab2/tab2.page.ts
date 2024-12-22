import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonModal, IonSearchbar, IonList, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CardClienteSingleton } from '../card-cliente/card-cliente.singleton';
import { Cliente } from '../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { ModalCrearClienteComponent } from '../modal-crear-cliente/modal-crear-cliente.component';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonLabel, IonList,IonItem, IonButton,IonSearchbar, IonModal,  IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, NgFor, CardClienteSingleton],

})
export class Tab2Page {
  clientes = () => this.database.getClientes();// Recupera las mesas desde la base de datos

  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController, private database: DatabaseService) {}
  async openModalCrearCliente(){

  }
  goToDetails(cliente: Cliente) {
    this.router.navigate(['detalles-cliente'], { relativeTo: this.route, queryParams: cliente });
  }


  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public results = [...this.data];
  handleInput(event:any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
  }
}
