import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoadProductManuallyComponent } from './pages/exhcanges/product/load-product-manually/load-product-manually.component';
import { NewProductComponent } from './pages/exhcanges/product/new-product/new-product.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoadFileComponent } from './pages/load-file/load-file.component';
import { LoadProductCodesComponent } from './pages/load-product-codes/load-product-codes.component';
import { LoadCampaignCodesComponent } from './pages/campaign/load-campaign-codes/load-campaign-codes.component';
import { NewCampaignComponent } from './pages/campaign/new-campaign/new-campaign.component';
import { BenefitTitlesComponent } from './pages/benefit/benefit-titles/benefit-titles.component';
import { PayBannerComponent } from './pages/pay/pay-banner/pay-banner.component';
import { AdvancePromoComponent } from './pages/advance-promo/advance-promo.component';
import { BenefitPeriodsComponent } from './pages/benefit/benefit-periods/benefit-periods.component';
import { CampaignsComponent } from './pages/notifications/campaigns/campaigns.component';
import { PushOnOffComponent } from './pages/notifications/on-off/push-on-off.component';
import { CreateCampaignComponent } from './pages/notifications/create-campaign/create-campaign.component';
import { EpuPushComponent } from './pages/notifications/epu-push/epu-push.component';
import { NewCategoryComponent } from './pages/exhcanges/category/new-category/new-category.component';
import { InhibitionTimeComponent } from './pages/nps-survey/inhibition-time/inhibition-time.component';
import { TimeoutTimeComponent } from './pages/nps-survey/timeout-time/timeout-time.component';
import { DownloadProductCodesComponent } from './pages/download-product-codes/download-product-codes.component';
import { DownloadInvalidProductCodesComponent } from './pages/download-invalid-product-codes/download-invalid-product-codes.component';
import { ListCategoryComponent } from './pages/exhcanges/category/list-category/list-category.component';
import { ListProductComponent } from './pages/exhcanges/product/list-product/list-product.component';
import { DownloadBenefitCodesComponent } from './pages/download-benefit-codes/download-benefit-codes.component';
import { DownloadBenefitTransactionsComponent } from './pages/download-benefit-transactions/download-benefit-transactions.component';
import { DownloadBenefitSubscriptionsComponent } from './pages/download-benefit-subscriptions/download-benefit-subscriptions.component';
import { NewSliderCampaignComponent } from './pages/campaignEngine/new-slider-campaign/new-slider-campaign.component';
import { ListCampaignsComponent } from './pages/campaignEngine/list-campaigns/list-campaign.component';
import { NewAvSavCampaignComponent } from './pages/campaignEngine/new-avsav-campaign/new-avsav-campaign.component';
import { DownloadUnemploymentInsuranceComponent } from './pages/download-unemployment-insurance/download-unemployment-insurance.component';
import { NewAvsavSimulationCampaignComponent } from './pages/campaignEngine/new-avsav-sim-campaign/new-avsav-sim-campaign.component';
import { NewWelcomeCampaignComponent } from './pages/campaignEngine/new-welcome-campaign/new-welcome-campaign.component';
import { DashboardBannerComponent } from './pages/dashboard-ripley-points/dashboard-banner/dashboard-banner.component';
import { LoadDatacardsUsersComponent } from '@apps/pages/data-cards/load-datacards-users/load-datacards-users.component';
import { ListDatacardsUsersComponent } from '@apps/pages/data-cards/list-datacards-users/list-datacards-users.component';
import { PushStatsComponent } from '@apps/pages/notifications/stats/push-stats.component';
import { NewDashboardCampaignComponent } from './pages/campaignEngine/new-dashboard-campaign/new-dashboard-campaign.component';
import { OnOffComponent } from '@apps/pages/on-off/on-off.component';
import { NewWelcomepackCampaignComponent } from './pages/campaignEngine/welcomepack-campaign/new-welcomepack-campaign.component';
import { NewBenefitScreenComponent } from './pages/campaignEngine/screens/benefits/new-benefit-screen.component';
import { NewRipleyPointComponent } from './pages/campaignEngine/screens/ripley-points/new-ripley-points.component';
import { CardswpComponent } from './pages/campaignEngine/screens/cardswp/cardswp.component';
import { ListWelcomepacksComponent } from './pages/campaignEngine/list-welcomepacks/list-welcomepacks.component';
import { EditWelcomepackCampaignComponent } from './pages/campaignEngine/welcomepack-campaign/edit-welcomepack-campaign.component';
import { UploadConfigComponent } from '@apps/pages/notifications/upload-config/upload-config.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { LoginConfigComponent } from '@apps/pages/login-config/login-config.component';
import { BenefitTagComponent } from './pages/benefit/benefit-tag/benefit-tag.component';
import { EmbeddedLoginComponent } from '@apps/pages/login-embedded/embedded-login.component';
import { DownloadLogsComponent } from '@apps/pages/download-logs/download-logs.component';
import { CreatePromotionBannerComponent } from '@apps/pages/upload-promotion-banner/create-promotion-banner.component';
import { NewBenefitCreationComponent } from './pages/benefit/new-benefit-creation/new-benefit-creation.component';
import { CardReissueComponent } from './pages/card-reissue/card-reissue.component';
import {ExternalComponent} from '@apps/layout/external/external.component';
import {InternalComponent} from '@apps/layout/internal/internal.component';
import { DownloadProductTransactionsComponent } from './pages/download-product-transactions/download-product-transactions.component';
import { UploadBenefitFilesComponent } from './pages/upload-benefit-files/upload-benefit-files.component';
import { UploadCodesComponent } from './pages/upload-benefit-files/upload-codes/upload-codes.component';
import { UploadRutsComponent } from './pages/upload-benefit-files/upload-ruts/upload-ruts.component';
import { ListGroupComponent } from './pages/exhcanges/group/list-group/list-group.component';
import { FeaturedRedeemComponent } from './pages/exhcanges/group/featured-redeem/featured-redeem.component';
import { DeleteProductTransactionsComponent } from './pages/delete-product-transactions/delete-product-transactions.component';
import { BenefitSegmentsComponent } from './pages/benefit/benefit-segments/benefit-segments.component';
import { BenefitBannersComponent } from './pages/benefit/benefit-banners/benefit-banners.component';



/* eslint-disable max-len */
export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: ExternalComponent,
    children: [
      { path: 'login', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    path: '',
    component: InternalComponent,
    children: [
      { path: 'campaignV2', loadChildren: () => import('./modules/campaign/campaign.module').then(m => m.CampaignModule), canActivate: [AuthGuard] }, //Todo cambiar nombre path cuando se haga el swith con el antiguo
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { controlName: 'home' } },
      { path: 'new-benefit-creation', component: NewBenefitCreationComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'new-benefit-creation/:id', component: NewBenefitCreationComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'benefit-banners', component: BenefitBannersComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'benefit-titles', component: BenefitTitlesComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'benefit-tag', component: BenefitTagComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'benefit-periods', component: BenefitPeriodsComponent, canActivate: [AuthGuard], data: { controlName: 'benefits' } },
      { path: 'load-product-manually', component: LoadProductManuallyComponent, canActivate: [AuthGuard], data: { controlName: 'load-product' } },
      { path: 'list-product', component: ListProductComponent, canActivate: [AuthGuard], data: { controlName: 'list-product' } },
      { path: 'new-product', component: NewProductComponent, canActivate: [AuthGuard], data: { controlName: 'new-product' } },
      { path: 'load-product-codes', component: LoadProductCodesComponent, canActivate: [AuthGuard], data: { controlName: 'load-product-codes' } },
      { path: 'download-product-codes', component: DownloadProductCodesComponent, canActivate: [AuthGuard], data: { controlName: 'download-product-codes' } },
      { path: 'download-invalid-product-codes', component: DownloadInvalidProductCodesComponent, canActivate: [AuthGuard], data: { controlName: 'download-invalid-product-codes' } },
      { path: 'load-campaign-codes', component: LoadCampaignCodesComponent, canActivate: [AuthGuard], data: { controlName: 'load-campaign-codes' } },
      { path: 'uploads-benefit-files', component: UploadBenefitFilesComponent, canActivate: [AuthGuard], data: { controlName: 'uploads-benefit-files' } },
      { path: 'upload-codes/:id', component: UploadCodesComponent, canActivate: [AuthGuard], data: { controlName: 'upload-codes' } },
      { path: 'upload-ruts/:id', component: UploadRutsComponent, canActivate: [AuthGuard], data: { controlName: 'upload-ruts' } },
      { path: 'new-campaign', component: NewCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-campaign' } },
      { path: 'new-category', component: NewCategoryComponent, canActivate: [AuthGuard], data: { controlName: 'new-category' } },
      { path: 'list-category', component: ListCategoryComponent, canActivate: [AuthGuard], data: { controlName: 'list-category' } },
      { path: 'load-file', component: LoadFileComponent, canActivate: [AuthGuard], data: { controlName: 'load-file' } },
      { path: 'pay-banner', component: PayBannerComponent, canActivate: [AuthGuard], data: { controlName: 'pay-banner' } },
      { path: 'campaigns', component: CampaignsComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'push-on-off', component: PushOnOffComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'create-campaign', component: CreateCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'epu-push', component: EpuPushComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'push-stats', component: PushStatsComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'upload-config', component: UploadConfigComponent, canActivate: [AuthGuard], data: { controlName: 'push' } },
      { path: 'advance-promo/:id', component: AdvancePromoComponent, canActivate: [AuthGuard], data: { controlName: 'promotions' } },
      { path: 'inhibition-time', component: InhibitionTimeComponent, canActivate: [AuthGuard], data: { controlName: 'nps' } },
      { path: 'timeout-time', component: TimeoutTimeComponent, canActivate: [AuthGuard], data: { controlName: 'nps' } },
      { path: 'download-benefit-subscriptions', component: DownloadBenefitSubscriptionsComponent, canActivate: [AuthGuard], data: { controlName: 'download-benefit-subscriptions' } },
      { path: 'download-benefit-codes', component: DownloadBenefitCodesComponent, canActivate: [AuthGuard], data: { controlName: 'download-benefit-codes' } },
      { path: 'download-benefit-transactions', component: DownloadBenefitTransactionsComponent, canActivate: [AuthGuard], data: { controlName: 'download-benefit-transactions' } },
      { path: 'download-logs', component: DownloadLogsComponent, canActivate: [AuthGuard], data: { controlName: 'download-logs' } },
      { path: 'unemployment-insurance', component: DownloadUnemploymentInsuranceComponent, canActivate: [AuthGuard], data: { controlName: 'export' } },
      // { path: 'users-config', component: UsersDashboardComponent, canActivate: [AuthGuard] }
      { path: 'new-slider-campaign', component: NewSliderCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-slider-campaign' } },
      { path: 'new-avsav-campaign', component: NewAvSavCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-avsav-campaign' } },
      { path: 'new-credit-sim-campaign', component: NewAvsavSimulationCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-credit-sim-campaign' } },
      { path: 'new-welcome-campaign', component: NewWelcomeCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'new-welcomepack-campaign', component: NewWelcomepackCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'edit-welcomepack-campaign', component: EditWelcomepackCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'new-cards-screen', component: CardswpComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'new-benefit-screen', component: NewBenefitScreenComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'new-ripley-points-screen', component: NewRipleyPointComponent, canActivate: [AuthGuard], data: { controlName: 'new-welcome-campaign' } },
      { path: 'new-dashboard-campaign', component: NewDashboardCampaignComponent, canActivate: [AuthGuard], data: { controlName: 'new-dashboard-campaign' } },
      { path: 'list-campaigns', component: ListCampaignsComponent, canActivate: [AuthGuard], data: { controlName: 'list-campaigns' } },
      { path: 'list-welcomepack-campaigns', component: ListWelcomepacksComponent, canActivate: [AuthGuard], data: { controlName: 'list-campaigns' } },
      { path: 'dashboard-banner', component: DashboardBannerComponent, canActivate: [AuthGuard], data: { controlName: 'dashboard-banner' } },
      { path: 'load-datacards-users', component: LoadDatacardsUsersComponent, canActivate: [AuthGuard], data: { controlName: 'load-datacards-users' } },
      { path: 'list-datacards-users', component: ListDatacardsUsersComponent, canActivate: [AuthGuard], data: { controlName: 'list-datacards-users' } },
      { path: 'on-off', component: OnOffComponent, canActivate: [AuthGuard], data: { controlName: 'on-off' } },
      { path: 'customer-service', component: CustomerServiceComponent, canActivate: [AuthGuard], data: { controlName: 'customer-service' } },
      { path: 'login-config', component: LoginConfigComponent, canActivate: [AuthGuard], data: { controlName: 'login-config' } },
      { path: 'embedded-login-config', component: EmbeddedLoginComponent, canActivate: [AuthGuard], data: { controlName: 'embedded-login-config' } },
      { path: 'card-reissue-config', component: CardReissueComponent, canActivate: [AuthGuard], data: { controlName: 'card-reissue-config' } },
      { path: 'promotion-banner', component: CreatePromotionBannerComponent, canActivate: [AuthGuard], data: { controlName: 'promotion-banner' } },
      { path: 'download-product-transactions', component: DownloadProductTransactionsComponent, canActivate: [AuthGuard], data: { controlName: 'download-product-transactions' } },
      { path: 'list-group', component: ListGroupComponent, canActivate: [AuthGuard], data: { controlName: 'list-group' } },
      { path: 'featured-redeem', component: FeaturedRedeemComponent, canActivate: [AuthGuard], data: { controlName: 'featured-redeem' } },
      { path: 'delete-product-transactions', component: DeleteProductTransactionsComponent, canActivate: [AuthGuard], data: { controlName: 'delete-product-transactions' } },
      { path: 'benefit-segments', component: BenefitSegmentsComponent, canActivate: [AuthGuard], data: { controlName: 'benefit-segments' } }
    ]
  },
  { path: '**', redirectTo: '/home'}
];
