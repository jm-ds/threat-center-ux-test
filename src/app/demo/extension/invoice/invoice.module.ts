import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    InvoiceRoutingModule,
   ThemeSharedModule,
  ],
  declarations: []
})
export class InvoiceModule { }
