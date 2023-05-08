import { Component } from '@angular/core';
import { ColDefinitionInterface } from '@apps/modules/campaign/shared/components/table-generic/models/col-definition.interface';
import { DataTableInterface } from '@apps/modules/campaign/shared/components/table-generic/models/data-table.interface';
import { CampaignMock } from '@apps/services/campaign.mock';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  public exampleData: DataTableInterface[] = [];
  public exampleCols: string[] = [];
  public definitionColumns: ColDefinitionInterface[];

  constructor(campaignMock: CampaignMock) {
    this.exampleData = campaignMock.getListSliderCampaign();
    this.exampleCols = campaignMock.getListSliderCols();
    this.definitionColumns = campaignMock.getListDefinitionSliderCampaign();
  }

  public getNewEvent(data) {
    console.log(data);
  }

  public getNewAction(data) {
    console.log(data);
  }

  public toDelete(data) {
    console.log(data);
  }
}
