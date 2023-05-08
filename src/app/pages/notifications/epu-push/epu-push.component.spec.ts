import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EpuPushComponent } from './epu-push.component';

describe('EpuPushComponent', () => {
  let component: EpuPushComponent;
  let fixture: ComponentFixture<EpuPushComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EpuPushComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpuPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
