import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFieldsComponent } from './base-fields.component';

describe('BaseFieldsComponent', () => {
  let component: BaseFieldsComponent;
  let fixture: ComponentFixture<BaseFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
