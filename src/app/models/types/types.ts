export type CampaignType = 'slider' | 'welcome' | 'avsav' | 'avsavSimulation' | 'dashboard';
export type TemplateType = 'page-minime' | 'page-benefits-welcomepack' | 'page-cards-welcomepack' | 'page-flex' | 'page-custom-minime';
export type NotificationType = 'marketing' | 'transactional' | 'redeem' | 'remarketing';
export type AdminLogAction =
  'load-codes' | 'create-product' | 'update-product' |
  'create-category' | 'update-category' |
  'load-campaign-ruts' | 'create-campaign' | 'update-campaign'|
  'download-valid-product-codes'| 'download-invalid-product-codes' |
  'create-product-transaction';
