import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSummaryRoutingModule } from './invoice-summary-routing.module';
import { InvoiceSummaryComponent } from './invoice-summary.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    InvoiceSummaryRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [InvoiceSummaryComponent]
})
export class InvoiceSummaryModule { }
