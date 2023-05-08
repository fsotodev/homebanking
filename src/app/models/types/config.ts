export class ChatBotConfig {
  public enabled: boolean;
  public enabledMobile: boolean;
  public enabledTotem: boolean;
  public enabledIframe: boolean;
  public activeFilterDV: boolean;
  public activeFilterRut: boolean;
  public userFilterDV: string[];
  public userFilterRut: string[];
}

export const ChatBotConfigItems = {
  enabled: { text: 'Desktop', position: 1 },
  enabledMobile: { text: 'Mobile', position: 2 },
  enabledTotem: { text: 'Totem', position: 3 },
  enabledIframe: { text: 'Iframe', position: 4 },
  activeFilterDV: { text: 'filtrar por DV', position: 5 },
  activeFilterRut: { text: 'filtrar por RUT', position: 6 },
};

export class ConsumerCreditConfig {
  public active: boolean;
  public activeIntermittent: boolean;
  public intermittent: boolean;
}

export const ConsumerCreditConfigItems = {
  active: { text: 'activo', position: 1 },
  intermittent: { text: 'intermitente', position: 3 },
  activeIntermittent: { text: 'habilitar intermitencia', position: 2 },
};

export class EmbedConfig {
  public enabled: boolean;
  public backgroundImg: string;
  public centerOverlayImg: string;
  public rightOverlayImg: string;
}

