import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SliderComponent } from './components/home/slider/slider.component';
import { WelcomeComponent } from './components/home/welcome/welcome.component';
import { AvsavComponent } from './components/home/avsav/avsav.component';
import { AvsavSimulationComponent } from './components/home/avsav-simulation/avsav-simulation.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { TableGenericComponent } from './shared/components/table-generic/table-generic.component';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { BaseFieldsComponent } from './components/base-form/base-fields/base-fields.component';
import { SliderFieldsComponent } from './components/base-form/slider-fields/slider-fields.component';
import { WelcomeFieldsComponent } from './components/base-form/welcome-fields/welcome-fields.component';
import { AvsavFieldsComponent } from './components/base-form/avsav-fields/avsav-fields.component';
import { AvsavSimulationFieldsComponent } from './components/base-form/avsav-simulation-fields/avsav-simulation-fields.component';
import { DashboardFieldsComponent } from './components/base-form/dashboard-fields/dashboard-fields.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomPaginatorComponent } from './shared/components/table-generic/custom-paginator/custom-paginator.component';
import { CampaignMock } from '@apps/services/campaign.mock';
import { MatMenuModule } from '@angular/material/menu'; // TODO: must delete when it has implemented real func

@NgModule({
  declarations: [
    HomeComponent,
    SliderComponent,
    WelcomeComponent,
    AvsavComponent,
    AvsavSimulationComponent,
    DashboardComponent,
    TableGenericComponent,
    BaseFormComponent,
    TabsComponent,
    BaseFieldsComponent,
    SliderFieldsComponent,
    WelcomeFieldsComponent,
    AvsavFieldsComponent,
    AvsavSimulationFieldsComponent,
    DashboardFieldsComponent,
    CustomPaginatorComponent
  ],
  providers: [ CampaignMock ],
  exports: [
    TableGenericComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatMenuModule
  ]
})
export class CampaignModule { }
