import { Component, OnInit } from '@angular/core';
import { Menu } from '@apps/models/interfaces/menu';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss']
})
export class InternalComponent implements OnInit {
  public isEnabledNewMenu = false;
  public MENU: Menu[] = [
    {
      id: 'benefits',
      name: 'Beneficios',
      icon: 'i-ticket',
      submenus: [{id: 'sub-benefits-1', name: 'Admin. Beneficios', navigateTo: 'home'},
        {id: 'sub-benefits-2', name: 'Tipos de Beneficios', navigateTo: 'benefit-titles'},
        {id: 'sub-benefits-3', name: 'Data de Subscripción', navigateTo: 'download-benefit-subscriptions'},
        {id: 'sub-benefits-4', name: 'Data de Códigos', navigateTo: 'download-benefit-codes'},
        {id: 'sub-benefits-5', name: 'Data de Transacciones', navigateTo: 'download-benefit-transactions'},
        {id: 'sub-benefits-6', name: 'Tags', navigateTo: 'benefit-tag'},
        {id: 'sub-benefits-7', name: 'Cargar códigos y ruts', navigateTo: 'uploads-benefit-files'},
        {id: 'sub-benefits-8', name: 'Segmentos', navigateTo: 'benefit-segments'},
        {id: 'sub-benefits-9', name: 'Banners', navigateTo: 'benefit-banners'}]
    },
    {
      id: 'upload',
      name: 'Cargar',
      icon: 'i-ticket',
      submenus: [{id: 'sub-upload-1', name: 'Imagen', navigateTo: 'load-file'}]
    },
    {
      id: 'campaign',
      name: 'Campañas',
      icon: 'i-ticket',
      submenus: [{id: 'sub-campaign-1', name: 'Crear Campaña', navigateTo: 'new-campaign'}]
    },
    {
      id: 'exchange',
      name: 'Canjes',
      icon: 'i-ticket',
      submenus: [{id: 'sub-exchange-1', name: 'Categoría - Ver Categorías', navigateTo: 'list-category'},
        {id: 'sub-exchange-2', name: 'Categoría - Crear Categorías', navigateTo: 'new-category'},
        {id: 'sub-exchange-3', name: 'Productos - Ver Productos', navigateTo: 'list-product'},
        {id: 'sub-exchange-4', name: 'Productos - Crear Productos', navigateTo: 'new-product'},
        {id: 'sub-exchange-5', name: 'Productos - Crear Canje', navigateTo: 'load-product-manually'},
        {id: 'sub-exchange-6', name: 'Productos - Cargar Códigos', navigateTo: 'load-product-codes'},
        {id: 'sub-exchange-7', name: 'Productos - Descargar Códigos Válidos', navigateTo: 'download-product-codes'},
        {
          id: 'sub-exchange-8',
          name: 'Productos - Descargar Códigos Vencidos',
          navigateTo: 'download-invalid-product-codes'
        },
        {
          id: 'sub-exchange-9',
          name: 'Productos - Descarga de SuperCanjes',
          navigateTo: 'download-product-transactions'
        },
        {id: 'sub-exchange-10', name: 'Banners', navigateTo: 'dashboard-banner'}]
    },
    {
      id: 'pay',
      name: 'Pagar',
      icon: 'i-ticket',
      submenus: [{id: 'sub-pay-1', name: 'Editar Banner', navigateTo: 'pay-banner'}]
    },
    {
      id: 'promotions',
      name: 'Promociones',
      icon: 'i-ticket',
      submenus: [{id: 'sub-promotions-1', name: 'Avance', navigateTo: 'advance-promo/av'},
        {id: 'sub-promotions-2', name: 'Super Avance', navigateTo: 'advance-promo/sav'},
        {id: 'sub-promotions-3', name: 'Banner', navigateTo: 'promotion-banner'}]
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      icon: 'i-ticket',
      submenus: [{id: 'sub-promotions-1', name: 'Campañas', navigateTo: 'campaigns'},
        {id: 'sub-promotions-2', name: 'On/Off', navigateTo: 'push-on-off'},
        {id: 'sub-promotions-3', name: 'EPU Push', navigateTo: 'epu-push'},
        {id: 'sub-promotions-4', name: 'Estadísticas', navigateTo: 'push-stats'},
        {id: 'sub-promotions-5', name: 'Upload Config', navigateTo: 'upload-config'}]
    },
    {
      id: 'nps',
      name: 'Encuestas NPS',
      icon: 'i-ticket',
      submenus: [{id: 'sub-nps-1', name: 'Tiempo de Inhibición', navigateTo: 'inhibition-time'},
        {id: 'sub-nps-2', name: 'Tiempo de Espera', navigateTo: 'timeout-time'}]
    },
    {
      id: 'export',
      name: 'Exportar',
      icon: 'i-ticket',
      submenus: [{id: 'sub-export-1', name: 'Seguro de cesantía', navigateTo: 'unemployment-insurance'},
        {id: 'sub-export-2', name: 'Logs', navigateTo: 'download-logs'}]
    },
    {
      id: 'client',
      name: 'Servicio al Cliente',
      icon: 'i-ticket',
      submenus: [{id: 'sub-client-1', name: 'Reclamo por dv', navigateTo: 'customer-service'}]
    },
    {
      id: 'campaign-engine',
      name: 'Motor de Campañas',
      icon: 'i-ticket',
      submenus: [{
        id: 'sub-campaign-engine-1',
        name: 'Crear - Slider (Banner Inteligente)',
        navigateTo: 'new-slider-campaign'
      },
      {id: 'sub-campaign-engine-2', name: 'Crear - Avsav (3ª Caja)', navigateTo: 'new-avsav-campaign'},
      {
        id: 'sub-campaign-engine-3',
        name: 'Crear - Avsav Simulacion',
        navigateTo: 'new-credit-sim-campaign?type=avsavSimulation'
      },
      {
        id: 'sub-campaign-engine-4',
        name: 'Crear - Consumo Simulacion',
        navigateTo: 'new-credit-sim-campaign?type=ccSimulation'
      },
      {id: 'sub-campaign-engine-5', name: 'Crear - Minime/Popup', navigateTo: 'new-welcome-campaign'},
      {id: 'sub-campaign-engine-6', name: 'Crear - Welcomepack', navigateTo: 'new-welcomepack-campaign'},
      {
        id: 'sub-campaign-engine-7',
        name: 'Crear - Dashboard (Ripley Puntos Go)',
        navigateTo: 'new-dashboard-campaign'
      },
      {id: 'sub-campaign-engine-8', name: 'Crear Pantalla - Crear P. Productos', navigateTo: 'new-campaign'},
      {id: 'sub-campaign-engine-9', name: 'Crear Pantalla - Crear P. beneficios', navigateTo: 'new-campaign'},
      {id: 'sub-campaign-engine-10', name: 'Crear Pantalla - Crear P. Ripley puntos', navigateTo: 'new-campaign'},
      {id: 'sub-campaign-engine-11', name: 'Ver Campañas', navigateTo: 'list-campaigns'},
      {id: 'sub-campaign-engine-12', name: 'Ver Welcomepacks', navigateTo: 'list-welcomepack-campaigns'}]
    },
    {
      id: 'campaign-engine',
      name: 'Datos de Tarjeta',
      icon: 'i-ticket',
      submenus: [{id: 'sub-campaign-engine-1', name: 'Cargar', navigateTo: 'load-datacards-users'},
        {id: 'sub-campaign-engine-2', name: 'Usuarios', navigateTo: 'list-datacards-users'}]
    },
    {
      id: 'config',
      name: 'Config PWA',
      icon: 'i-ticket',
      submenus: [{id: 'sub-campaign-engine-1', name: 'On/Off', navigateTo: 'on-off'},
        {id: 'sub-campaign-engine-2', name: 'Login', navigateTo: 'login-config'},
        {id: 'sub-campaign-engine-3', name: 'Login Embebido', navigateTo: 'embedded-login-config'},
        {id: 'sub-campaign-engine-4', name: 'Carga de RUT', navigateTo: 'card-reissue-config'}]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
