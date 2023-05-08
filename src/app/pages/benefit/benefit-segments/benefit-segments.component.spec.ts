import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitSegmentsComponent } from './benefit-segments.component';

describe('BenefitSegmentsComponent', () => {
  let component: BenefitSegmentsComponent;
  let fixture: ComponentFixture<BenefitSegmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitSegmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
