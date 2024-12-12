import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  test1 = "";
  test2="filtro-bn";
  test3="filtro-bn"
  clickHistorial() {
    this.test1 = "filtro-bn";
    this.test2 = "filtro-bn";
    this.test3 = "";
  }

  clickCliente() {
    this.test1 = "filtro-bn";
    this.test2 = "";
    this.test3 = "filtro-bn";
  }
  clickMesa() {
    this.test1 = "";
    this.test2 = "filtro-bn";
    this.test3 = "filtro-bn";
  }
  constructor() {
    
  }

}
