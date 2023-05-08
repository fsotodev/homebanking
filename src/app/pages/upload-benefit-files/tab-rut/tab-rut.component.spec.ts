/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabRutComponent } from './tab-rut.component';

describe('TabRutComponent', () => {
  let component: TabRutComponent;
  let fixture: ComponentFixture<TabRutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabRutComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabRutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
