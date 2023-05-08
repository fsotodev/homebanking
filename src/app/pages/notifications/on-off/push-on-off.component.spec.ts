import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PushOnOffComponent } from './push-on-off.component';

describe('OnOffComponent', () => {
  let component: PushOnOffComponent;
  let fixture: ComponentFixture<PushOnOffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PushOnOffComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushOnOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
