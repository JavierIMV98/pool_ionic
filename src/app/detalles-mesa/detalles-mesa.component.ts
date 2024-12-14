import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular'; // Para alertas y notificaciones
import { DatabaseService } from '../services/database.service';
import { Mesa } from '../services/database.service'; // Ajusta según la ubicación de tu modelo
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detalles-mesa',
  templateUrl: './detalles-mesa.component.html',
  styleUrls: ['./detalles-mesa.component.scss'],
  standalone: true,
  imports: [
    // Importaciones necesarias para componentes de Ionic
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule
  ],
})
export class DetallesMesaComponent implements OnInit {
  item: Mesa; // Representa la mesa seleccionada

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.route.queryParams.subscribe((params) => {
      this.item = params as Mesa; // Carga los datos desde la URL
    });
  }

  ngOnInit() {}

  // Método para actualizar los datos de la mesa
  async onActualizar() {
    try {
      // Llamar al método del servicio para actualizar la mesa
      await this.database.updateMesa(this.item);
      console.log('Mesa actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la mesa', error);
    }
  }

  // Método para eliminar la mesa
  async onEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar Mesa',
      message: `¿Estás seguro de que quieres eliminar la mesa ${this.item.numero}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.database.deleteMesa(this.item.numero); // Llama al servicio
            this.showToast('Mesa eliminada con éxito.');
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para mostrar notificaciones tipo toast
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
