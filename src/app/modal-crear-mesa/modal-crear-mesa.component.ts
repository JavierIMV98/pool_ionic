import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonPicker } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-modal-crear-mesa',
  templateUrl: './modal-crear-mesa.component.html',
  styleUrls: ['./modal-crear-mesa.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonPicker],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ModalCrearMesaComponent  implements OnInit {

  name: string = '';

  selectedMesa: number = 1;
  selectedTime: string = "";
  selectedPrice: number  =75;

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Número de mesa
  prices = [75, 80, 85, 90, 92, 97, 100, 110, 113, 120, 125, 130, 135];

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onIonChange(event: any) {
    const customEvent = event as CustomEvent<any>; // Forzamos el tipo a CustomEvent
    this.selectedMesa = customEvent.detail.value; // Accedemos al valor
    console.log('Mesa seleccionada:', this.selectedMesa);
  }

  onIonChange2(event: any) {
    const customEvent = event as CustomEvent<any>; // Forzamos el tipo a CustomEvent
    this.selectedTime = customEvent.detail.value; // Accedemos al valor
    console.log('Hora seleccionada:', this.selectedTime);
  }

  onIonChange3(event: any) {
    const customEvent = event as CustomEvent<any>; // Forzamos el tipo a CustomEvent
    this.selectedPrice = customEvent.detail.value; // Accedemos al valor
    console.log('Precio seleccionada:', this.selectedPrice);
  }
  confirm() {
    return this.modalCtrl.dismiss({
      mesa: this.selectedMesa,
      hora: this.selectedTime,
      precio: this.selectedPrice
    }, 'confirm');
  }

  ngOnInit() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.selectedTime = `${hours}:${minutes}`; // Formato HH:mm
  }

}
