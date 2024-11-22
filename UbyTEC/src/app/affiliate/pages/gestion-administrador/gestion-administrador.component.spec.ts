import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdministradorComponent } from './gestion-administrador.component';

describe('GestionAdministradorComponent', () => {
  let component: GestionAdministradorComponent;
  let fixture: ComponentFixture<GestionAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
