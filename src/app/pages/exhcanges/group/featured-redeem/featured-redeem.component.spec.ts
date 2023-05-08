import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedRedeemComponent } from './featured-redeem.component';

describe('FeaturedRedeemComponent', () => {
  let component: FeaturedRedeemComponent;
  let fixture: ComponentFixture<FeaturedRedeemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedRedeemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
