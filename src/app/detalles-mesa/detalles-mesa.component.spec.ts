import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetallesMesaComponent } from './detalles-mesa.component';

describe('DetallesMesaComponent', () => {
  let component: DetallesMesaComponent;
  let fixture: ComponentFixture<DetallesMesaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DetallesMesaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
