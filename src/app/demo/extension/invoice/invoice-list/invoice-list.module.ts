import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceListRoutingModule } from './invoice-list-routing.module';
import { InvoiceListComponent } from './invoice-list.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    InvoiceListRoutingModule,
   ThemeSharedModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  declarations: [InvoiceListComponent]
})
export class InvoiceListModule { }
