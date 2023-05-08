import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BenefitTagModalComponent } from './benefit-tag-modal.component';

describe('BenefitTagModalComponent', () => {
  let component: BenefitTagModalComponent;
  let fixture: ComponentFixture<BenefitTagModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitTagModalComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitTagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
