import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvsavComponent } from './avsav.component';

describe('AvsavComponent', () => {
  let component: AvsavComponent;
  let fixture: ComponentFixture<AvsavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvsavComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvsavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
