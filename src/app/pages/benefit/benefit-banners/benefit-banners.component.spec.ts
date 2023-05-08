import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitBannersComponent } from './benefit-banners.component';

describe('BenefitBannersComponent', () => {
  let component: BenefitBannersComponent;
  let fixture: ComponentFixture<BenefitBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitBannersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
