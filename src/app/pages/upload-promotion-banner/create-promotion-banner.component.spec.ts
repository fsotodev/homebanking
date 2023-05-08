import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatePromotionBannerComponent } from './create-promotion-banner.component';

describe('CreatePromotionBannerComponent', () => {
  let component: CreatePromotionBannerComponent;
  let fixture: ComponentFixture<CreatePromotionBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePromotionBannerComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePromotionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
