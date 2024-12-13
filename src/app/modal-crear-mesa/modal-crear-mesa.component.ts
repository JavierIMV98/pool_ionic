import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonPicker } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Mesa } from '../services/database.service';
import { NgFor } from '@angular/common';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-modal-crear-mesa',
  templateUrl: './modal-crear-mesa.component.html',
  styleUrls: ['./modal-crear-mesa.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonPicker, NgFor],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ModalCrearMesaComponent  implements OnInit {

  name: string = '';

  objmesa: Mesa;

  numero: number;
  inicio: string;
  precio: number = 0;

  nrosdisponibles: number[] = this.database.getNrosDisp();

  selectedMesa: number = 1;
  selectedTime: string = "";
  selectedPrice: number  =75;

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Número de mesa
  prices = [75, 80, 85, 90, 92, 97, 100, 110, 113, 120, 125, 130, 135];

  constructor(private modalCtrl: ModalController, private database: DatabaseService) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  confirm() {
    // Verificar si todos los campos requeridos están llenos y no son null/undefined
    if (this.numero !== undefined && this.selectedTime && this.precio !== undefined) {
      // Crear un nuevo objeto Mesa
      const nuevaMesa = {
        numero: this.numero,
        inicio: this.selectedTime,
        precio: this.precio,
        extras: 0 // Puedes definir un valor por defecto para los extras si es necesario
      };

      // Insertar la nueva mesa en la base de datos
      this.database.insertMesa(nuevaMesa).then(() => {
        this.modalCtrl.dismiss(nuevaMesa, 'confirm');
      }).catch(error => {
        console.error('Error al insertar la mesa:', error);
        alert('Error al insertar la mesa.');
      });
    } else {
      // Mostrar un mensaje de error si alguno de los campos está vacío
      alert('Por favor, completa todos los campos.');
    }
  }

  ngOnInit() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.selectedTime = `${hours}:${minutes}`; // Formato HH:mm
    this.nrosdisponibles = this.database.getNrosDisp();
  }

  onNumeroChange(value: any) {
    this.numero = value;
  }
  onPrecioChange(value: any) {
    this.precio = value;
  }
  getSelectValue(event: any): any {
    return event ? event.target.value : null;
  }

}
