import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProductTransactionsComponent } from './download-product-transactions.component';

describe('DownloadProductTransactionsComponent', () => {
  let component: DownloadProductTransactionsComponent;
  let fixture: ComponentFixture<DownloadProductTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadProductTransactionsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProductTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
