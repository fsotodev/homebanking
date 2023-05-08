import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BenefitTagComponent } from './benefit-tag.component';

describe('BenefitTagComponent', () => {
  let component: BenefitTagComponent;
  let fixture: ComponentFixture<BenefitTagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitTagComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
