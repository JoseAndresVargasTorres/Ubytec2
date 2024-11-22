import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarCarritoComponent } from './administrar-carrito.component';

describe('AdministrarCarritoComponent', () => {
  let component: AdministrarCarritoComponent;
  let fixture: ComponentFixture<AdministrarCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
