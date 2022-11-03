import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCotizacionesComponent } from './mis-cotizaciones.component';

describe('MisCotizacionesComponent', () => {
  let component: MisCotizacionesComponent;
  let fixture: ComponentFixture<MisCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisCotizacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
