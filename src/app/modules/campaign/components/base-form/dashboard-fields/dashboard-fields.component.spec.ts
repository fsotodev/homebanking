import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFieldsComponent } from './dashboard-fields.component';

describe('DashboardFieldsComponent', () => {
  let component: DashboardFieldsComponent;
  let fixture: ComponentFixture<DashboardFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
