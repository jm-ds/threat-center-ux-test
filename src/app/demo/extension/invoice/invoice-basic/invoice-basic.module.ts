import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceBasicRoutingModule } from './invoice-basic-routing.module';
import { InvoiceBasicComponent } from './invoice-basic.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    InvoiceBasicRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [InvoiceBasicComponent]
})
export class InvoiceBasicModule { }
