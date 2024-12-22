import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute ,  Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular'; // Para alertas y notificaciones
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
export class DetallesClienteSingleton  implements OnInit {
  item:Cliente;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService,
    private alertController: AlertController,
    private toastController: ToastController) { 
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
      if (!this.item ) {
        alert('Por favor, revisa los datos antes de actualizar.');
        return;
      }
  
      console.log('Datos enviados para actualización:', this.item);
  
      const resultado = await this.database.updateCliente(this.item);
  
      if (resultado) {
        alert('Cliente actualizada correctamente.');
        this.router.navigate(['/tabs/tab2']); // Redirigir después de confirmar
      } else {
        alert('No se pudo actualizar cliente. Verifica los datos.');
      }
    } catch (error) {
      console.error('Error al intentar actualizar  cliente:', error);
      alert('Hubo un error. Intenta más tarde.');
    }
  }

  async onEliminar() {
    if (!this.item) return;
  
    // Mostrar confirmación antes de eliminar
    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar cliente ${this.item.nombre}?`
    );
  
    if (!confirmar) {
      console.log('Eliminación cancelada por el usuario.');
      return; // Si el usuario cancela, no se realiza ninguna acción
    }

  
      // Eliminar la mesa
      const resultado = await this.database.deleteCliente(this.item.nombre, this.item.deuda, this.item.extras);
      
      if(resultado){
        alert('Cliente eliminado.');
        this.router.navigate(['/tabs/tab2']);
      }
    } 
}

  
