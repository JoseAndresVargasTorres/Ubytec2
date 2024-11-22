import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarTiposdeComercioComponent } from './gestionar-tiposde-comercio.component';

describe('GestionarTiposdeComercioComponent', () => {
  let component: GestionarTiposdeComercioComponent;
  let fixture: ComponentFixture<GestionarTiposdeComercioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarTiposdeComercioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarTiposdeComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
