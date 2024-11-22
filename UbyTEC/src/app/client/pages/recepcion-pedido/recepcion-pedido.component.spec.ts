import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionPedidoComponent } from './recepcion-pedido.component';

describe('RecepcionPedidoComponent', () => {
  let component: RecepcionPedidoComponent;
  let fixture: ComponentFixture<RecepcionPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
