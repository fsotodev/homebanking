import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChileanCurrencyPipe } from './chilean-currency.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ChileanCurrencyPipe ],
  exports: [ ChileanCurrencyPipe ]
})
export class ChileanCurrencyModule {}
