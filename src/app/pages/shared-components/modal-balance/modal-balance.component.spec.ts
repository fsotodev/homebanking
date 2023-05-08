import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalBalanceComponent } from './modal-balance.component';

describe('ModalBalanceComponent', () => {
  let component: ModalBalanceComponent;
  let fixture: ComponentFixture<ModalBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBalanceComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
