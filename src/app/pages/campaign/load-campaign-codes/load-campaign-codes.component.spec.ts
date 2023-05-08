import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoadCampaignCodesComponent } from './load-campaign-codes.component';

fdescribe('LoadCampaignCodesComponent', () => {
  let component: LoadCampaignCodesComponent;
  let fixture: ComponentFixture<LoadCampaignCodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCampaignCodesComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCampaignCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
