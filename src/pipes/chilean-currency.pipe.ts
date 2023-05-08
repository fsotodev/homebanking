import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'chileanCurrency'})
export class ChileanCurrencyPipe implements PipeTransform {
  transform(value: number, sign: boolean = true): string {
    let peso = '';
    if (sign) {
      peso = '$';
    }
    return (value || value === 0)
      ? peso + String(value).split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, '$1.').split('').reverse().join('')
      : '';
  }
}
