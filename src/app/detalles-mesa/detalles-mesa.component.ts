import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute ,  Router } from '@angular/router';
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
  total: any;

  constructor(
    private router: Router,
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
      // Validar si los datos de `item` son correctos
      if (!this.item || !this.item.numero || !this.item.inicio || this.item.precio <= 0) {
        console.error('Datos inválidos para actualizar:', this.item);
        alert('Por favor, revisa los datos antes de actualizar.');
        return;
      }
  
      console.log('Datos enviados para actualización:', this.item);
  
      // Llamar al método del servicio para actualizar la mesa
      const resultado = await this.database.updateMesa(this.item);
  
      if (resultado) {
        console.log('Mesa actualizada exitosamente:', resultado);
        alert('Mesa actualizada correctamente.');
  
        // Opcional: Redirigir al usuario a otra página después de actualizar
        setTimeout(() => {
          // Asegúrate de tener el Router importado en el componente
          this.router.navigate(['/tabs/tab1']); // Ruta anterior
        }, 2000); // Esperar 2 segundos antes de redirigir
      } else {
        console.error('La actualización no devolvió ningún resultado.');
        alert('No se pudo actualizar la mesa. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al actualizar la mesa:', error);
      alert('Hubo un error al intentar actualizar la mesa. Por favor, intenta más tarde.');
    }
  }
  

  // Método para eliminar la mesa
async onEliminar() {
  if (!this.item) return;

  // Mostrar confirmación antes de eliminar
  const confirmar = confirm(
    `¿Estás seguro de que deseas eliminar la mesa número ${this.item.numero}?`
  );

  if (!confirmar) {
    console.log('Eliminación cancelada por el usuario.');
    return; // Si el usuario cancela, no se realiza ninguna acción
  }

  try {
    const ahora = new Date(); // Hora actual
    const horaFinal = `${ahora
      .getHours()
      .toString()
      .padStart(2, '0')}:${ahora.getMinutes()
      .toString()
      .padStart(2, '0')}`; // Hora en formato HH:mm

    // Calcular la diferencia en minutos
    const inicio = this.item.inicio.split(':'); // Suponiendo que `inicio` está en formato HH:mm
    const horaInicio = new Date(ahora);
    horaInicio.setHours(parseInt(inicio[0]), parseInt(inicio[1]), 0, 0);

    const diferenciaMinutos = Math.floor(
      (ahora.getTime() - horaInicio.getTime()) / 60000
    );
    const total = diferenciaMinutos * this.item.precio; // Cálculo del total

    // Crear el registro del historial
    const registroHistorial = {
      numero: this.item.numero,
      inicio: this.item.inicio,
      final: horaFinal,
      total: total,
    };

    // Insertar el registro en el historial
    await this.database.insertRegistro(registroHistorial);

    // Eliminar la mesa
    await this.database.deleteMesa(this.item.numero);

    // Volver a la ruta anterior después de unos segundos
    setTimeout(() => {
      this.router.navigate(['/tabs/tab1']);
    }, 2000);

    alert('Mesa eliminada y registrada en el historial correctamente.');
  } catch (error) {
    console.error('Error al eliminar la mesa:', error);
    alert('Hubo un error al eliminar la mesa.');
  }
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
