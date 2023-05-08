import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadConfigComponent } from './upload-config.component';

describe('PushConfigComponentComponent', () => {
  let component: UploadConfigComponent;
  let fixture: ComponentFixture<UploadConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadConfigComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
