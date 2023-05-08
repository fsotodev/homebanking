import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrpgoMenuConfigComponent } from './webrpgo-menu-config.component';

describe('WebrpgoMenuConfigComponent', () => {
  let component: WebrpgoMenuConfigComponent;
  let fixture: ComponentFixture<WebrpgoMenuConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebrpgoMenuConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrpgoMenuConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
