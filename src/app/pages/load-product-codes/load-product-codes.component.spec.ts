import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadProductCodesComponent } from './load-product-codes.component';

describe('LoadProductCodesComponent', () => {
  let component: LoadProductCodesComponent;
  let fixture: ComponentFixture<LoadProductCodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadProductCodesComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadProductCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
