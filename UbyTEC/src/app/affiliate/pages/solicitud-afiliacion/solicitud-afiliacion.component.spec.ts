import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAfiliacionComponent } from './solicitud-afiliacion.component';

describe('SolicitudAfiliacionComponent', () => {
  let component: SolicitudAfiliacionComponent;
  let fixture: ComponentFixture<SolicitudAfiliacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudAfiliacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudAfiliacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
