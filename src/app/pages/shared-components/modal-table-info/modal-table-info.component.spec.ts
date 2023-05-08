import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalTableInfoComponent } from './modal-table-info.component';

describe('ModalTableInfoComponent', () => {
  let component: ModalTableInfoComponent;
  let fixture: ComponentFixture<ModalTableInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTableInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
