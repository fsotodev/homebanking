import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvsavSimulationFieldsComponent } from './avsav-simulation-fields.component';

describe('AvsavSimulationFieldsComponent', () => {
  let component: AvsavSimulationFieldsComponent;
  let fixture: ComponentFixture<AvsavSimulationFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvsavSimulationFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvsavSimulationFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
