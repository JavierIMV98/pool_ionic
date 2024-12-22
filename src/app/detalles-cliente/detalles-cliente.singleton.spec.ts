import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetallesClienteSingleton } from './detalles-cliente.singleton';

describe('DetallesClienteSingleton', () => {
  let component: DetallesClienteSingleton;
  let fixture: ComponentFixture<DetallesClienteSingleton>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesClienteSingleton ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesClienteSingleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
