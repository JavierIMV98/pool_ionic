import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';
import {SplashScreen} from '@capacitor/splash-screen'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private database: DatabaseService) {
    this.initApp();
  }

  async initApp(){
    await this.database.initializPlugin();
    SplashScreen.hide();
  }
}
