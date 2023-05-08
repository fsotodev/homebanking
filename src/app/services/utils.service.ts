import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Injectable()
export class UtilsService {

  constructor(
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }

  getParsedDate(date: any = new Date()) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

  async formatRutsCsvData(data: any[]): Promise<any> {
    return data.map( (element) => [ element[0].replace(/[\.-]/g, '').toLowerCase()]);
  }

  public sanitizeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public getScssUrl(url: string) {
    if (url) {
      return 'url(\'' + url.trim() + '\')';
    }
    return 'url(undefined)';
  }

  public getHtmlContent(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }

  public compare(a, b) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  }

  public areShallowEqual(o1, o2) {
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (o1[key] !== o2[key]) {
        return false;
      }
    }

    return true;
  }

  generateFileRutName(fileName: string, userName: string): string {
    return `${this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' +
    this.datePipe.transform(new Date(), 'HH:mm:ss')}_${userName}_${fileName}`;
  }

  public cleanValue(oldValue: string) {
    return oldValue.normalize('NFD').replace(/[\u0300-\u036f]|\`|\´|\*|-|\.|\//g, '');
  }

  public onKeyPress(event: KeyboardEvent) {
    const BLOCK_KEYS = ['Dead', ' ', '*', '[', ']', '.', '/'];
    if (BLOCK_KEYS.find( code => code === event.key)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
