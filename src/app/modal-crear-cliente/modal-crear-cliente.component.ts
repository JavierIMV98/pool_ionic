import { Component, OnInit, effect, computed  } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonPicker } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Cliente } from '../services/database.service';
import { NgFor } from '@angular/common';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-modal-crear-cliente',
  templateUrl: './modal-crear-cliente.component.html',
  styleUrls: ['./modal-crear-cliente.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonPicker, NgFor],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ModalCrearClienteComponent  implements OnInit {
  nombre:string = '';
  deuda:number=0;
  extras:string = '';
  constructor(private modalCtrl: ModalController, private database: DatabaseService) {}

  ngOnInit() {}



  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  confirm() {
    if (this.nombre) {
      const nuevoCliente: Cliente = {
        nombre: this.nombre,
        deuda: this.deuda,
        extras: this.extras,
      };
  
      console.log('Cleinte a insertar: (modal)', nuevoCliente);
  
      this.database.insertCliente(nuevoCliente).then(() => {
        console.log('Cliente insertada correctamente en la base de datos.');
        this.modalCtrl.dismiss(nuevoCliente, 'confirm');
      }).catch(error => {
        console.error('Error al insertar la mesa en la base de datos:', error);
        alert('Error al insertar la mesa.');
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

}
