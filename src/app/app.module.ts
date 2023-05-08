import { BrowserModule } from '@angular/platform-browser';
import { ChileanCurrencyModule } from '../pipes/chilean-currency.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
/* import { WebComponentsModule } from '@bit/kunder_dispositivos.ripley-poc.web-components'; */
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '@apps/shared/shared.module';

// For Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoadProductManuallyComponent } from './pages/exhcanges/product/load-product-manually/load-product-manually.component';
import { NewProductComponent } from './pages/exhcanges/product/new-product/new-product.component';
import { NewCategoryComponent } from './pages/exhcanges/category/new-category/new-category.component';
import { ProductViewerComponent } from './pages/exhcanges/product/product-viewer/product-viewer.component';
import { LoadFileComponent } from './pages/load-file/load-file.component';
import { UsersDashboardComponent } from './pages/users-dashboard/users-dashboard.component';
import { ModalUserComponent } from './pages/users-dashboard/_modal-user.component';
import { BenefitTitlesComponent } from './pages/benefit/benefit-titles/benefit-titles.component';
import { BenefitPeriodsComponent } from './pages/benefit/benefit-periods/benefit-periods.component';
import { ModalDialogComponent } from './pages/shared-components/modal-dialog/modal-dialog.component';
import { PayBannerComponent } from './pages/pay/pay-banner/pay-banner.component';
import { AdvancePromoComponent } from './pages/advance-promo/advance-promo.component';
import { ModalTableInfoComponent } from './pages/shared-components/modal-table-info/modal-table-info.component';
import { CampaignsComponent } from './pages/notifications/campaigns/campaigns.component';
import { PushOnOffComponent } from './pages/notifications/on-off/push-on-off.component';
import { CreateCampaignComponent } from './pages/notifications/create-campaign/create-campaign.component';
import { EpuPushComponent } from './pages/notifications/epu-push/epu-push.component';
import { InhibitionTimeComponent } from './pages/nps-survey/inhibition-time/inhibition-time.component';
import { TimeoutTimeComponent } from './pages/nps-survey/timeout-time/timeout-time.component';
import { LoadProductCodesComponent } from './pages/load-product-codes/load-product-codes.component';
import { DownloadProductCodesComponent } from './pages/download-product-codes/download-product-codes.component';
import { DownloadInvalidProductCodesComponent } from './pages/download-invalid-product-codes/download-invalid-product-codes.component';
import { Utils } from './pages/shared-components/utils/utils';
import { ModalBalanceComponent } from './pages/shared-components/modal-balance/modal-balance.component';
import { ListCategoryComponent } from './pages/exhcanges/category/list-category/list-category.component';
import { ListProductComponent } from './pages/exhcanges/product/list-product/list-product.component';
import { LoadCampaignCodesComponent } from './pages/campaign/load-campaign-codes/load-campaign-codes.component';
import { NewCampaignComponent } from './pages/campaign/new-campaign/new-campaign.component';
import { NewWelcomepackCampaignComponent } from './pages/campaignEngine/welcomepack-campaign/new-welcomepack-campaign.component';
import { NewBenefitScreenComponent } from './pages/campaignEngine/screens/benefits/new-benefit-screen.component';
import { NewRipleyPointComponent } from './pages/campaignEngine/screens/ripley-points/new-ripley-points.component';
import { DownloadBenefitCodesComponent } from './pages/download-benefit-codes/download-benefit-codes.component';
import { DownloadBenefitTransactionsComponent } from './pages/download-benefit-transactions/download-benefit-transactions.component';
import { DownloadBenefitSubscriptionsComponent } from './pages/download-benefit-subscriptions/download-benefit-subscriptions.component';
import { ModalProductCodesComponent } from './pages/shared-components/modal-product-codes/modal-product-codes.component';
import { DownloadUnemploymentInsuranceComponent } from './pages/download-unemployment-insurance/download-unemployment-insurance.component';
import { NewSliderCampaignComponent } from './pages/campaignEngine/new-slider-campaign/new-slider-campaign.component';
import { NewAvSavCampaignComponent } from './pages/campaignEngine/new-avsav-campaign/new-avsav-campaign.component';
import { ListCampaignsComponent } from './pages/campaignEngine/list-campaigns/list-campaign.component';
import { ListWelcomepacksComponent } from './pages/campaignEngine/list-welcomepacks/list-welcomepacks.component';
import { DashboardBannerComponent } from './pages/dashboard-ripley-points/dashboard-banner/dashboard-banner.component';
import { DownloadRutCampaignComponent } from './pages/download-rut-campaign/download-rut-campaign.component';
import { LoadDatacardsUsersComponent } from '@apps/pages/data-cards/load-datacards-users/load-datacards-users.component';
import { ListDatacardsUsersComponent } from '@apps/pages/data-cards/list-datacards-users/list-datacards-users.component';
import { ModalDatacardRecordComponent } from '@apps/pages/shared-components/modal-datacard-record/modal-datacard-record.component';
import { PushStatsComponent } from '@apps/pages/notifications/stats/push-stats.component';
import { NewAvsavSimulationCampaignComponent } from './pages/campaignEngine/new-avsav-sim-campaign/new-avsav-sim-campaign.component';
import { NewWelcomeCampaignComponent } from './pages/campaignEngine/new-welcome-campaign/new-welcome-campaign.component';
import { NewDashboardCampaignComponent } from './pages/campaignEngine/new-dashboard-campaign/new-dashboard-campaign.component';
import { UploadConfigComponent } from './pages/notifications/upload-config/upload-config.component';
// Components
import { LoadFileButtonComponent } from './components/load-file-button/load-file-button.component';
import { BenefitsPreviewComponent } from './components/benefits-preview/benefits-preview.component';
import { RipleyPointsPreviewComponent } from './components/ripley-points-preview/ripley-points-preview.component';

// Services

import { AuthGuard } from './shared/guards/auth.guard';
import { ModalDialogService } from './services/modal-dialog.service';
import { FirebaseService } from './services/firebase.service';
import { BenefitsService } from './services/benefits.service';
import { ProductTransactionsService } from './services/productTransactions.service';
import { ProductsService } from './services/products.service';
import { CampaignsEngineService } from './services/campaigns-engine.service';
import { PushCampaignsService } from './services/push-campaigns.service';
import { CampaignService } from './services/campaign.service';
import { NpsService } from './services/nps.service';
import { CategoryService } from './services/category.service';
import { ExportService } from './services/export.service';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppComponent } from './app.component';
import { environment } from '@environments/environment';
import { appRoutes } from './app-routing.module';
import { UtilsService } from './services/utils.service';
import { OnOffComponent } from '@apps/pages/on-off/on-off.component';
import { CardswpComponent } from './pages/campaignEngine/screens/cardswp/cardswp.component';
import { CardswpPreviewComponent } from './components/cardswp-preview/cardswp-preview.component';
import { WaveComponent } from './components/wave/wave.component';
import { EditWelcomepackCampaignComponent } from './pages/campaignEngine/welcomepack-campaign/edit-welcomepack-campaign.component';
import { ModalUploadConfigComponent } from './pages/shared-components/modal-upload-config/modal-upload-config.component';
import { LoginConfigComponent } from '@apps/pages/login-config/login-config.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { BenefitTagComponent } from './pages/benefit/benefit-tag/benefit-tag.component';
import { BenefitTagModalComponent } from './pages/benefit/benefit-tag-modal/benefit-tag-modal.component';
import { EmbeddedLoginComponent } from '@apps/pages/login-embedded/embedded-login.component';
import { DownloadLogsComponent } from '@apps/pages/download-logs/download-logs.component';
import { CreatePromotionBannerComponent } from '@apps/pages/upload-promotion-banner/create-promotion-banner.component';
import { NewBenefitCreationComponent } from './pages/benefit/new-benefit-creation/new-benefit-creation.component';
import { BenefitStepOneComponent } from './pages/benefit/new-benefit-creation/benefit-step-one/benefit-step-one.component';
import { BenefitStepTwoComponent } from './pages/benefit/new-benefit-creation/benefit-step-two/benefit-step-two.component';
import { BenefitStepThreeComponent } from './pages/benefit/new-benefit-creation/benefit-step-three/benefit-step-three.component';
import { BenefitStepFourComponent } from './pages/benefit/new-benefit-creation/benefit-step-four/benefit-step-four.component';
import { BenefitStepFiveComponent } from './pages/benefit/new-benefit-creation/benefit-step-five/benefit-step-five.component';
import { NewBenefitPreviewComponent } from './pages/benefit/new-benefit-creation/new-benefit-preview/new-benefit-preview.component';
// import { NewBenefitCreationModule } from './pages/benefit/new-benefit-creation/new-benefit-creation.module';
// import { NewBenefitCreationComponent } from './pages/benefit/new-benefit-creation/new-benefit-creation.component';
import { CardReissueComponent } from './pages/card-reissue/card-reissue.component';
import { ExternalComponent } from './layout/external/external.component';
import { InternalComponent } from './layout/internal/internal.component';
import { DownloadProductTransactionsComponent } from './pages/download-product-transactions/download-product-transactions.component';
import { UploadBenefitFilesComponent } from './pages/upload-benefit-files/upload-benefit-files.component';
import { UploadCodesComponent } from './pages/upload-benefit-files/upload-codes/upload-codes.component';
import { TabCodeComponent } from './pages/upload-benefit-files/tab-code/tab-code.component';
import { TabRutComponent } from './pages/upload-benefit-files/tab-rut/tab-rut.component';
import { UploadRutsComponent } from './pages/upload-benefit-files/upload-ruts/upload-ruts.component';
import { CampaignModule } from '@apps/modules/campaign/campaign.module';
import { ListGroupComponent } from './pages/exhcanges/group/list-group/list-group.component';
import { FeaturedRedeemComponent } from './pages/exhcanges/group/featured-redeem/featured-redeem.component';
import { StatusPipe } from './shared/utils/status-pipe';
import { DeleteProductTransactionsComponent } from './pages/delete-product-transactions/delete-product-transactions.component';
import { DeleteProductTransactionsDialogComponent }
from './pages/delete-product-transactions/dialog/delete-product-transactions-dialog.component';
import { BenefitSegmentsComponent } from './pages/benefit/benefit-segments/benefit-segments.component';
import { BenefitBannersComponent } from './pages/benefit/benefit-banners/benefit-banners.component';
import { InsuranceCardRutComponent } from './pages/card-reissue/components/insurance-card-rut/insurance-card-rut.component';
import { NotificationComponent } from './pages/card-reissue/components/notification/notification.component';
import { WebrpgoMenuConfigComponent } from './pages/webrpgo/webrpgo-menu-config/webrpgo-menu-config.component';
import { WebRPGOService } from './services/webrpgo.service';
import { WebMenuListUseCase } from './usecase/WebMenuList';
import { DeleteMenuListUseCase } from './usecase/DeleteMenuList';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoadProductManuallyComponent,
    NewProductComponent,
    NewCategoryComponent,
    BenefitsPreviewComponent,
    ProductViewerComponent,
    ModalDialogComponent,
    LoadFileComponent,
    LoadCampaignCodesComponent,
    NewCampaignComponent,
    NewWelcomepackCampaignComponent,
    EditWelcomepackCampaignComponent,
    NewBenefitScreenComponent,
    RipleyPointsPreviewComponent,
    NewRipleyPointComponent,
    CardswpComponent,
    CardswpPreviewComponent,
    UsersDashboardComponent,
    ModalUserComponent,
    LoadProductCodesComponent,
    LoadFileButtonComponent,
    BenefitTitlesComponent,
    PayBannerComponent,
    AdvancePromoComponent,
    BenefitPeriodsComponent,
    ModalTableInfoComponent,
    CampaignsComponent,
    PushOnOffComponent,
    CreateCampaignComponent,
    PushStatsComponent,
    InhibitionTimeComponent,
    TimeoutTimeComponent,
    DownloadProductCodesComponent,
    DownloadInvalidProductCodesComponent,
    ModalBalanceComponent,
    EpuPushComponent,
    ListCategoryComponent,
    ListCampaignsComponent,
    ListWelcomepacksComponent,
    ListProductComponent,
    DownloadBenefitCodesComponent,
    DownloadBenefitTransactionsComponent,
    DownloadBenefitSubscriptionsComponent,
    ModalProductCodesComponent,
    DownloadUnemploymentInsuranceComponent,
    NewSliderCampaignComponent,
    NewAvSavCampaignComponent,
    NewAvsavSimulationCampaignComponent,
    NewWelcomeCampaignComponent,
    NewDashboardCampaignComponent,
    DashboardBannerComponent,
    DownloadRutCampaignComponent,
    LoadDatacardsUsersComponent,
    ListDatacardsUsersComponent,
    ModalDatacardRecordComponent,
    OnOffComponent,
    WaveComponent,
    UploadConfigComponent,
    ModalUploadConfigComponent,
    CustomerServiceComponent,
    LoginConfigComponent,
    BenefitTagComponent,
    BenefitTagModalComponent,
    EmbeddedLoginComponent,
    CardReissueComponent,
    NotificationComponent,
    DownloadLogsComponent,
    CreatePromotionBannerComponent,
    NewBenefitCreationComponent,
    BenefitStepOneComponent,
    BenefitStepTwoComponent,
    BenefitStepThreeComponent,
    BenefitStepFourComponent,
    BenefitStepFiveComponent,
    NewBenefitPreviewComponent,
    ExternalComponent,
    InternalComponent,
    DownloadProductTransactionsComponent,
    UploadBenefitFilesComponent,
    UploadCodesComponent,
    UploadRutsComponent,
    TabCodeComponent,
    TabRutComponent,
    ListGroupComponent,
    FeaturedRedeemComponent,
    StatusPipe,
    DeleteProductTransactionsComponent,
    DeleteProductTransactionsDialogComponent,
    BenefitSegmentsComponent,
    BenefitBannersComponent,
    InsuranceCardRutComponent,
    WebrpgoMenuConfigComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'corrected' }),
    SwiperModule,
    ChileanCurrencyModule,
    ClipboardModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    /* WebComponentsModule, */
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    CampaignModule
  ],
  providers: [
    AuthGuard,
    FirebaseService,
    BenefitsService,
    ProductTransactionsService,
    ProductsService,
    PushCampaignsService,
    CampaignService,
    NpsService,
    CampaignsEngineService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    Utils,
    ModalDialogService,
    DatePipe,
    CategoryService,
    ExportService,
    UtilsService,
    WebRPGOService,
    WebMenuListUseCase,
    DeleteMenuListUseCase
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalBalanceComponent,
    ModalDialogComponent,
    ModalUserComponent,
    ModalTableInfoComponent,
    ModalProductCodesComponent,
    ModalDatacardRecordComponent,
    ModalUploadConfigComponent,
    BenefitTagModalComponent,
    NewBenefitCreationComponent,
    DeleteProductTransactionsDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
