import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDialogComponent } from './modal-dialog.component';

describe('ModalDialogComponent', () => {
  let component: ModalDialogComponent;
  let fixture: ComponentFixture<ModalDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});