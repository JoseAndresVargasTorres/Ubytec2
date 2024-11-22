import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAdministradoresComponent } from './gestionar-administradores.component';

describe('GestionarAdministradoresComponent', () => {
  let component: GestionarAdministradoresComponent;
  let fixture: ComponentFixture<GestionarAdministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAdministradoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
