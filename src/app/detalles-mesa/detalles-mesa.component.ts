import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute ,  Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonCard, IonItem, IonLabel, IonAlert } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular'; // Para alertas y notificaciones
import { DatabaseService } from '../services/database.service';
import { Mesa } from '../services/database.service'; // Ajusta según la ubicación de tu modelo
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detalles-mesa',
  templateUrl: './detalles-mesa.component.html',
  styleUrls: ['./detalles-mesa.component.scss'],
  standalone: true,
  imports: [IonAlert, IonLabel, IonItem, 
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


  total = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.route.queryParams.subscribe((params) => {
      this.item = { ...params } as Mesa; // Crear una copia del objeto (PARA EVITAR EL READONLY)
      this.total = this.calcularTotal();
    });
  }

  ngOnInit() {}

  // Método para actualizar los datos de la mesa
  async onActualizar() {
    try {
      if (!this.item || !this.item.numero || !this.item.inicio || this.item.precio <= 0) {
        alert('Por favor, revisa los datos antes de actualizar.');
        return;
      }
  
      console.log('Datos enviados para actualización:', this.item);
  
      const resultado = await this.database.updateMesa(this.item);
  
      if (resultado) {
        alert('Mesa actualizada correctamente.');
        this.router.navigate(['/tabs/tab1']); // Redirigir después de confirmar
      } else {
        alert('No se pudo actualizar la mesa. Verifica los datos.');
      }
    } catch (error) {
      console.error('Error al intentar actualizar la mesa:', error);
      alert('Hubo un error. Intenta más tarde.');
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
      const horaInicio = new Date();
      horaInicio.setHours(parseInt(inicio[0]), parseInt(inicio[1]), 0, 0);
  
      // Si la hora final es menor que la hora inicial, asumir que pertenece al día siguiente
      if (horaInicio > ahora) {
        ahora.setDate(ahora.getDate() + 1); // Avanzar un día para la hora actual
      }
  
      const diferenciaMinutos = Math.floor(
        (ahora.getTime() - horaInicio.getTime()) / 60000
      );
  
      let total = diferenciaMinutos * this.item.precio; // Cálculo del total

      // Validación del mínimo
      if (diferenciaMinutos < 55) {
        total = diferenciaMinutos;
      }
  
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
      const resultado = await this.database.deleteMesa(this.item.numero);
      
      if(resultado){
        alert('Mesa eliminada y registrada en el historial correctamente.');
        this.router.navigate(['/tabs/tab1']);
      }
    } catch (error) {
      console.error('Error al eliminar la mesa:', error);
      alert('Hubo un error al eliminar la mesa.');
    }
  }
  
private calcularTotal(){
  try{
    const ahora = new Date(); // Hora actual
    const horaFinal = `${ahora
      .getHours()
      .toString()
      .padStart(2, '0')}:${ahora.getMinutes()
      .toString()
      .padStart(2, '0')}`; // Hora en formato HH:mm

    // Calcular la diferencia en minutos
    const inicio = this.item.inicio.split(':'); // Suponiendo que `inicio` está en formato HH:mm
    const horaInicio = new Date();
    horaInicio.setHours(parseInt(inicio[0]), parseInt(inicio[1]), 0, 0);

    // Si la hora final es menor que la hora inicial, asumir que pertenece al día siguiente
    if (horaInicio > ahora) {
      ahora.setDate(ahora.getDate() + 1); // Avanzar un día para la hora actual
    }

    const diferenciaMinutos = Math.floor(
      (ahora.getTime() - horaInicio.getTime()) / 60000
    );

    const total = diferenciaMinutos * this.item.precio; // Cálculo del total
    const suma = Number(total) + Number(this.item.extras);
    if(diferenciaMinutos < 55){
      let detalle:string = "Tiempo: (" + diferenciaMinutos + ") + Extras: (" + this.item.extras + ")";
      return detalle;
    }else{
      let detalle:string = "Tiempo: (" + diferenciaMinutos + ") = $" + total + " + Extras: (" + this.item.extras + ") = " + (suma);
      return detalle;
    }

  }catch (error) {
    console.error('Error al cargar datos', error);
    return "0"
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


  async cambiarMesa() {
    const alert = await this.alertController.create({
      header: 'Cambiar Mesa',
      message: 'Ingrese el número de la mesa (1-12)',
      inputs: [
        {
          name: 'mesaNumero',
          type: 'number',
          min: 1,
          max: 12,
          placeholder: this.item.numero.toString(),
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: async (data) => {
            const numeroMesa = data.mesaNumero;
  
            // Validar que el número de la mesa esté entre 1 y 12
            if (numeroMesa < 1 || numeroMesa > 12) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Por favor ingrese un número válido entre 1 y 12.',
                buttons: ['OK'],
              });
              await errorAlert.present();
              return;
            }
  
            // Verificar si la mesa existe en la base de datos
            const mesaExistente = await this.database.verificarMesa(numeroMesa);
  
            if (mesaExistente) {
              const replaceAlert = await this.alertController.create({
                header: 'Mesa Existente',
                message: `La mesa número ${numeroMesa} ya existe. ¿Desea reemplazarla?`,
                buttons: [
                  {
                    text: 'No',
                    role: 'cancel',
                  },
                  {
                    text: 'Sí',
                    handler: async () => {
                      // Crear un objeto Mesa para reemplazo
                      const nuevaMesa: Mesa = {
                        numero: numeroMesa,
                        inicio: this.item.inicio, // Establecer inicio actual
                        precio: this.item.precio, // Actualiza según tus reglas de negocio
                        extras: this.item.extras, // Actualiza según tus reglas de negocio
                      };
                      await this.onEliminarOtra(numeroMesa);
                      await this.reemplazarMesa(nuevaMesa);
                      await this.onEliminarSinHistorial();
                      this.router.navigate(['/tabs/tab1']);
                    },
                  },
                ],
              });
              await replaceAlert.present();
            } else {
              // Insertar nueva mesa
              const nuevaMesa: Mesa = {
                numero: numeroMesa,
                inicio: this.item.inicio,
                precio: this.item.precio,
                extras: this.item.extras,
              };
              await this.reemplazarMesa(nuevaMesa);
              await this.onEliminarSinHistorial();
              this.router.navigate(['/tabs/tab1']);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async reemplazarMesa(mesa: Mesa) {
    console.log("Reemplazar mesa")
    try {
      await this.database.reemplazarMesa(mesa);
  
      const successAlert = await this.alertController.create({
        header: 'Mesa Reemplazada',
        message: `La mesa número ${mesa.numero} ha sido reemplazada correctamente.`,
        buttons: ['OK'],
      });
      this.router.navigate(['/tabs/tab1']);
  
      await successAlert.present();
    } catch (error:any) {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: `Ocurrió un error al reemplazar la mesa: ${error.message}`,
        buttons: ['OK'],
      });
  
      await errorAlert.present();
    }
  }


  public alertInputs = [
    {
      name: 'mesaNumero',
      type: 'number',
      min: 1,
      max: 12,
      placeholder: 'Número de la mesa',
    },
  ];

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Aceptar',
      handler: async (data: any): Promise<void> => {
        const numeroMesa = data.mesaNumero;
  
        // Validar que el número de la mesa esté entre 1 y 12
        if (numeroMesa < 1 || numeroMesa > 12) {
          this.showAlertError('Error', 'Por favor ingrese un número válido entre 1 y 12.');
          return; // Termina la función sin hacer nada más
        }
  
        // Verificar si la mesa existe en la base de datos
        const mesaExistente = await this.database.verificarMesa(numeroMesa);
  
        if (mesaExistente) {
          this.showAlertExistente(numeroMesa);
        } else {
          // Insertar nueva mesa
          const nuevaMesa: Mesa = {
            numero: numeroMesa,
            inicio: this.item.inicio,
            precio: this.item.precio,
            extras: this.item.extras,
          };
          await this.database.insertMesa(nuevaMesa);
          await this.onEliminarSinHistorial()
          const successAlert = await this.alertController.create({
            header: 'Mesa Reemplazada',
            message: `La mesa número ${this.item.numero} ha sido reemplazada correctamente.`,
            buttons: ['OK'],
          });
          this.router.navigate(['/tabs/tab1']);
      
          await successAlert.present();
        }
  
        return; // Asegúrate de devolver algo, en este caso, nada (void)
      },
    },
  ];
  


  // Mostrar alerta de error
  private async showAlertError(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Mostrar alerta de confirmación para mesas existentes
  private async showAlertExistente(numeroMesa: number) {
    const alert = await this.alertController.create({
      header: 'Mesa Existente',
      message: `La mesa número ${numeroMesa} ya existe. ¿Desea reemplazarla?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            const nuevaMesa: Mesa = {
              numero: numeroMesa,
              inicio: this.item.inicio,
              precio: this.item.precio,
              extras: this.item.extras
            };
            await this.onEliminarSinHistorial();
            await this.onEliminarOtra(numeroMesa);
            await this.reemplazarMesa(nuevaMesa);
          },
        },
      ],
    });
    await alert.present();
  }



  async onEliminarSinHistorial() {
    console.log("Eliminar sin historial")
    if (!this.item) return;

    try {
      
      const resultado = await this.database.deleteMesa(this.item.numero);
  
    } catch (error) {
      console.error('Error al eliminar la mesa sin historial:', error);
      alert('Hubo un error al eliminar la mesa sin registrar en el historial.');
    }
  }

  async onEliminarOtra(numero:number) {
    console.log("Eliminar otra")
    try {
      
      const resultado = await this.database.deleteMesa(numero);
  
    } catch (error) {
      console.error('Error al eliminar la otra mesa:', error);
      alert('Hubo un error al eliminar la mesa sin registrar en el historial.');
    }
  }

}




