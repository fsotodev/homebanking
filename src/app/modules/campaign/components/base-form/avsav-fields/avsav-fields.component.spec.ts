import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvsavFieldsComponent } from './avsav-fields.component';

describe('AvsavFieldsComponent', () => {
  let component: AvsavFieldsComponent;
  let fixture: ComponentFixture<AvsavFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvsavFieldsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvsavFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
