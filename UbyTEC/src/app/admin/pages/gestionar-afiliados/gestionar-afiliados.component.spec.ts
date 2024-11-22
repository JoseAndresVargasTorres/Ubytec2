import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAfiliadosComponent } from './gestionar-afiliados.component';

describe('GestionarAfiliadosComponent', () => {
  let component: GestionarAfiliadosComponent;
  let fixture: ComponentFixture<GestionarAfiliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAfiliadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAfiliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
