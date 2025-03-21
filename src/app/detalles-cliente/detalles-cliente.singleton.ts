import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular'; // Solo AlertController
import { DatabaseService } from '../services/database.service';
import { Cliente } from '../services/database.service'; // Ajusta según la ubicación de tu modelo
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalles-cliente',
  templateUrl: './detalles-cliente.singleton.html',
  styleUrls: ['./detalles-cliente.singleton.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, 
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
export class DetallesClienteSingleton implements OnInit {
  item: Cliente;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService,
    private alertController: AlertController // Solo AlertController
  ) { 
    this.route.queryParams.subscribe((params) => {
      this.item = {
        nombre: params['nombre'] || '',
        deuda: params['deuda'] ? +params['deuda'] : 0, // Convertir a número
        extras: params['extras'] || '',
      } as Cliente;
    });
  }

  ngOnInit() {}

  async onActualizar() {
    try {
      if (!this.item) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Por favor, revisa los datos antes de actualizar.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      console.log('Datos enviados para actualización:', this.item);

      const resultado = await this.database.updateCliente(this.item);

      if (resultado) {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Cliente actualizado correctamente.',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/tabs/tab2']); // Redirigir después de confirmar
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar cliente. Verifica los datos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Error al intentar actualizar cliente:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error. Intenta más tarde.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async onEliminar() {
    if (!this.item) return;

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro de que deseas eliminar cliente ${this.item.nombre}?`,
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
            // Eliminar la mesa
            const resultado = await this.database.deleteCliente(this.item.nombre, this.item.deuda, this.item.extras);

            if (resultado) {
              const alert = await this.alertController.create({
                header: 'Éxito',
                message: 'Cliente eliminado.',
                buttons: ['OK']
              });
              await alert.present();
              this.router.navigate(['/tabs/tab2']);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
