import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalCrearMesaComponent } from './modal-crear-mesa.component';

describe('ModalCrearMesaComponent', () => {
  let component: ModalCrearMesaComponent;
  let fixture: ComponentFixture<ModalCrearMesaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalCrearMesaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCrearMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
