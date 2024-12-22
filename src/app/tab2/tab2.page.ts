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
  imports: [IonLabel, IonList, IonItem, IonButton, IonSearchbar, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, NgFor, CardClienteSingleton],
})
export class Tab2Page {
  clientes: Cliente[] = []; // Lista actualizada de clientes
  results: Cliente[] = []; // Lista filtrada para mostrar en pantalla
  private currentModal: HTMLIonModalElement | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController, private database: DatabaseService) {}

  async openModalCrearCliente() {
    this.currentModal = await this.modalController.create({
      component: ModalCrearClienteComponent,
    });
    await this.currentModal.present();
    const { data, role } = await this.currentModal.onWillDismiss();

    if (role === 'confirm') {
      this.actualizar(); // Vuelve a cargar los clientes después de cerrar el modal
    }
    return this.currentModal;
  }

  goToDetails(cliente: Cliente) {
    this.router.navigate(['detalles-cliente'], {
      relativeTo: this.route,
      queryParams: {
        nombre: cliente.nombre,
        deuda: cliente.deuda,
        extras: cliente.extras,
      },
    });
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    // Filtra la lista de clientes según el nombre
    this.results = this.clientes.filter((cliente: Cliente) =>
      cliente.nombre.toLowerCase().includes(query)
    );
  }

  ionViewWillEnter() {
    this.actualizar(); // Actualiza los datos cada vez que entres en la página
  }

  async actualizar() {
    // Llama al servicio para obtener los clientes desde la base de datos
    const clientesActualizados = await this.database.loadClientes(); // Suponiendo que `loadClientes` devuelve una Promise<Cliente[]>
    this.clientes = clientesActualizados;
    this.results = [...this.clientes]; // Inicializa `results` con todos los clientes
  }
}
