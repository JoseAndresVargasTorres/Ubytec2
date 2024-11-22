import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimasComprasComponent } from './ultimas-compras.component';

describe('UltimasComprasComponent', () => {
  let component: UltimasComprasComponent;
  let fixture: ComponentFixture<UltimasComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimasComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
