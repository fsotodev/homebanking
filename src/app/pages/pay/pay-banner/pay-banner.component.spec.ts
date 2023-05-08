import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PayBannerComponent } from './pay-banner.component';

describe('PayBannerComponent', () => {
  let component: PayBannerComponent;
  let fixture: ComponentFixture<PayBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PayBannerComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
