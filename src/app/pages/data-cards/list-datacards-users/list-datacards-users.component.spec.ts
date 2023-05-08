import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDatacardsUsersComponent } from './list-datacards-users.component';

describe('ListDatacardsUsersComponent', () => {
  let component: ListDatacardsUsersComponent;
  let fixture: ComponentFixture<ListDatacardsUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDatacardsUsersComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatacardsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
