import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesAfiliadosComponent } from './reportes-afiliados.component';

describe('ReportesAfiliadosComponent', () => {
  let component: ReportesAfiliadosComponent;
  let fixture: ComponentFixture<ReportesAfiliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesAfiliadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesAfiliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
