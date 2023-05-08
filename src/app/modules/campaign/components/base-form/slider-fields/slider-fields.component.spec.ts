import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderFieldsComponent } from './slider-fields.component';

describe('SliderFieldsComponent', () => {
  let component: SliderFieldsComponent;
  let fixture: ComponentFixture<SliderFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
