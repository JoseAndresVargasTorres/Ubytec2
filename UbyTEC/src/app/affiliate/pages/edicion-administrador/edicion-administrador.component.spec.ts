import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionAdministradorComponent } from './edicion-administrador.component';

describe('EdicionAdministradorComponent', () => {
  let component: EdicionAdministradorComponent;
  let fixture: ComponentFixture<EdicionAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicionAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
