import { ColDefinitionInterface } from '@apps/modules/campaign/shared/components/table-generic/models/col-definition.interface';
import { TypeInput } from '@apps/shared/utils/constants';
import { Injectable } from '@angular/core';
import { DataTableInterface } from '@apps/modules/campaign/shared/components/table-generic/models/data-table.interface';

@Injectable()
export class CampaignMock {

  DATA_TEST: DataTableInterface[] = [{ name: 'spinner-test-slider', priority: 1, views: 1, goals: 2, ctr: '3%', enabled: true
    , actions: [
      {nameButton: 'Editar', redirection: () => {}, icon: ''},
      {nameButton: 'Duplicar', redirection: () => {}, icon: ''},
      {nameButton: '...', redirection: () => {}, icon: ''}]}];

  public getListSliderCampaign(): DataTableInterface[] {
    const arrayInitial: DataTableInterface[]= [];
    for(let i=0;i<30; i++) {
      arrayInitial[i] = {name: `${this.DATA_TEST[0].name} - ${i}`,
        views: Math.floor(Math.random() * (100 + 1)),
        goals: Math.floor(Math.random() * (100 + 1)),
        ctr: (Math.random()*100).toString(10),
        enabled: true,
        actions: this.DATA_TEST[0].actions,
        priority: i};
    }
    return arrayInitial;
  }

  public getListSliderCols(): string[] {
    return ['selector', 'priority', 'name', 'views', 'goals', 'ctr', 'enabled', 'actions'];
  }

  public getListDefinitionSliderCampaign(): ColDefinitionInterface[] {
    return [
      {
        columnDef: 'selector',
        header: 'selector',
        type: TypeInput.matCheckbox,
        cell: (element: any) => {
        },
      },
      {
        columnDef: 'priority',
        header: 'Prioridad',
        type: TypeInput.matInput,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        style: {'max-width': '45px', 'text-align': 'center'},
        cell: (element: any) => `${element.priority}`,
      },
      {
        columnDef: 'name',
        header: 'Nombre',
        cell: (element: any) => `${element.name}`,
      },
      {
        columnDef: 'views',
        header: 'Views',
        cell: (element: any) => `${element.views}`,
      },
      {
        columnDef: 'goals',
        header: 'Goals',
        cell: (element: any) => `${element.goals}`,
      },
      {
        columnDef: 'enabled',
        header: 'Activo en PWA',
        type: TypeInput.matSlideToggle,
        cell: (element: any) => `${element.enabled}`,
      },
      {
        columnDef: 'ctr',
        header: '%CTR',
        cell: (element: any) => `${element.ctr}`,
      },
      {
        columnDef: 'actions',
        header: ' ',
        type: TypeInput.actions,
        cell: (element: any) => element.actions
      }
    ];
  }
}
