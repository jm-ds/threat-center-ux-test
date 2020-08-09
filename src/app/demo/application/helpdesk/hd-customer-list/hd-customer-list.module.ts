import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdCustomerListRoutingModule } from './hd-customer-list-routing.module';
import { HdCustomerListComponent } from './hd-customer-list.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [HdCustomerListComponent],
  imports: [
    CommonModule,
    HdCustomerListRoutingModule,
   ThemeSharedModule,
  ]
})
export class HdCustomerListModule { }
