import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { RegistroHistorial } from '../services/database.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular'; // Importamos AlertController

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, NgFor],
})
export class Tab3Page {
  registros = () => this.database.getRegistros();

  can_cobros: number = 0;
  tot_cobros: number = 0;

  constructor(
    private database: DatabaseService,
    private alertController: AlertController // Inyectamos AlertController
  ) {}

  ngOnInit() {
    this.actualizarTotales();
  }

  ionViewWillEnter() {
    this.actualizarTotales();
  }

  async borrarHisto() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro de que deseas eliminar el historial?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada por el usuario.');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.database.borrarHistorial();
            const alertSuccess = await this.alertController.create({
              header: 'Éxito',
              message: 'Historial Eliminado',
              buttons: ['OK']
            });
            await alertSuccess.present();
            this.actualizarTotales();
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminar(number: number, ini: string, fin: string, tot: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro de que deseas eliminar el registro?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada por el usuario.');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.database.deleteHistorial(number, ini, fin, tot);
            const alertSuccess = await this.alertController.create({
              header: 'Éxito',
              message: 'Registro Eliminado',
              buttons: ['OK']
            });
            await alertSuccess.present();
            this.actualizarTotales(); // Recalcular valores
          }
        }
      ]
    });
    await alert.present();
  }

  async actualizarTotales() {
    const { cantidad, suma } = await this.database.calcularTotalesHistorial();
    this.can_cobros = cantidad;
    this.tot_cobros = suma;
    console.log(`Cantidad: ${cantidad}, Suma: ${suma}`);
  }
}
