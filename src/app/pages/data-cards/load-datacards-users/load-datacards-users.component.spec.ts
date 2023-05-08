import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadDatacardsUsersComponent } from './load-datacards-users.component';

describe('LoadDatacardsUsersComponent', () => {
  let component: LoadDatacardsUsersComponent;
  let fixture: ComponentFixture<LoadDatacardsUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDatacardsUsersComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDatacardsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
