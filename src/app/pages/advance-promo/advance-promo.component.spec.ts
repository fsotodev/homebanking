import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancePromoComponent } from './advance-promo.component';

describe('AdvancePromoComponent', () => {
  let component: AdvancePromoComponent;
  let fixture: ComponentFixture<AdvancePromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePromoComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
