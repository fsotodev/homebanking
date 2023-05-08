import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFieldsComponent } from './welcome-fields.component';

describe('WelcomeFieldsComponent', () => {
  let component: WelcomeFieldsComponent;
  let fixture: ComponentFixture<WelcomeFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
