import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesConsolidadodeVentasComponent } from './reportes-consolidadode-ventas.component';

describe('ReportesConsolidadodeVentasComponent', () => {
  let component: ReportesConsolidadodeVentasComponent;
  let fixture: ComponentFixture<ReportesConsolidadodeVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesConsolidadodeVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesConsolidadodeVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
