import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarRepartidoresComponent } from './gestionar-repartidores.component';

describe('GestionarRepartidoresComponent', () => {
  let component: GestionarRepartidoresComponent;
  let fixture: ComponentFixture<GestionarRepartidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarRepartidoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarRepartidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
