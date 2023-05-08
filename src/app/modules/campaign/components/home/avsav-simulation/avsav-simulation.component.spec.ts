import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvsavSimulationComponent } from './avsav-simulation.component';

describe('AvsavSimulationComponent', () => {
  let component: AvsavSimulationComponent;
  let fixture: ComponentFixture<AvsavSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvsavSimulationComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvsavSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
