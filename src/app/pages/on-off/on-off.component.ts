import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@apps/services/firebase.service';
import { ChatBotConfig, ChatBotConfigItems, ConsumerCreditConfig, ConsumerCreditConfigItems } from '@apps/models/types/config';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-on-off',
  templateUrl: './on-off.component.html',
  styleUrls: ['./on-off.component.scss']
})
export class OnOffComponent implements OnInit {
  public categories = [
    'chatbot',
    'consumerCredit',
  ];
  public titles = {
    chatbot: 'Chatbot',
    consumerCredit: 'Créditos de consumo',
  };
  public isLoading: boolean;
  public isSaving: boolean;
  public configData: { [key: string]: any[] };
  public chatBotConfig: ChatBotConfig;
  public consumerCreditConfig: ConsumerCreditConfig;
  public user: User;

  constructor(
    private firebaseService: FirebaseService,
    public auth: AuthFirebaseService,
  ) { }

  public async ngOnInit() {
    this.isLoading = true;
    this.user = await this.auth.userInfo();
    this.configData = {};
    for (const type of this.categories) {
      this.configData[type] = [];
    }
    Promise.all([
      this.loadChatBotConfig(),
      this.loadConsumerCreditConfig(),
    ]).catch((err) => {
      this.isLoading = false;
      console.error('Error', err);
    }).finally(() => this.isLoading = false );
  }

  public isEnabled(item: any, type: string): boolean {
    return !item.isSaving && (this.user.type === 'admin' || (!!this.user.onOff && this.user.onOff.includes(type)));
  }

  public async updateConfig(event: any, type: string, index: number) {
    const configData = this.configData[type][index];
    configData.isSaving = true;
    const newData = {};
    newData[configData.originalProp] = event.checked;
    await configData.docRef.set(newData, { merge: true });
    configData.status = event.checked;
    configData.isSaving = false;
  }

  public async loadChatBotConfig() {
    const doc = await this.firebaseService.getData('chatbot');
    this.chatBotConfig = doc.data() as ChatBotConfig;
    this.configData.chatbot = [{
      status: this.chatBotConfig.enabled,
      name: ChatBotConfigItems['enabled'].text,
      isSaving: false,
      docRef: doc.ref,
      originalProp: 'enabled',
    }, {
      status: this.chatBotConfig.enabledMobile,
      name: ChatBotConfigItems['enabledMobile'].text,
      isSaving: false,
      docRef: doc.ref,
      originalProp: 'enabledMobile',
    }, {
      status: this.chatBotConfig.enabledTotem,
      name: ChatBotConfigItems['enabledTotem'].text,
      isSaving: false,
      docRef: doc.ref,
      originalProp: 'enabledTotem',
    }, {
      status: this.chatBotConfig.enabledIframe,
      name: ChatBotConfigItems['enabledIframe'].text,
      isSaving: false,
      docRef: doc.ref,
      originalProp: 'enabledIframe',
    }];
  }

  public async loadConsumerCreditConfig() {
    const doc = await this.firebaseService.getConfig('consumerCredit');
    this.consumerCreditConfig = doc.data() as ConsumerCreditConfig;
    this.configData.consumerCredit = [];
    for (const [k, v] of Object.entries(ConsumerCreditConfigItems)) {
      const data = {
        originalProp: k,
        docRef: doc.ref,
        isSaving: false,
        name: v.text,
        status: this.consumerCreditConfig[k],
        position: v.position,
      };
      this.configData.consumerCredit.push(data);
    }
    this.configData.consumerCredit.sort((a, b) => a.position - b.position);
  }
}
