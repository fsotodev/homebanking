import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalUploadConfigComponent } from './modal-upload-config.component';

describe('ModalPushConfigComponent', () => {
  let component: ModalUploadConfigComponent;
  let fixture: ComponentFixture<ModalUploadConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUploadConfigComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUploadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
