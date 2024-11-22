import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAfiliacionesComponent } from './gestionar-afiliaciones.component';

describe('GestionarAfiliacionesComponent', () => {
  let component: GestionarAfiliacionesComponent;
  let fixture: ComponentFixture<GestionarAfiliacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAfiliacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAfiliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
