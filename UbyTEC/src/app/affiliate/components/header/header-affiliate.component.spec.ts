import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAffiliateComponent } from './header-affiliate.component';

describe('HeaderComponent', () => {
  let component: HeaderAffiliateComponent;
  let fixture: ComponentFixture<HeaderAffiliateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAffiliateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
