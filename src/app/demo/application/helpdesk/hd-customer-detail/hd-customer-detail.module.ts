import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdCustomerDetailRoutingModule } from './hd-customer-detail-routing.module';
import { HdCustomerDetailComponent } from './hd-customer-detail.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [HdCustomerDetailComponent],
  imports: [
    CommonModule,
    HdCustomerDetailRoutingModule,
   ThemeSharedModule,
  ]
})
export class HdCustomerDetailModule { }
