import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdCustomerRoutingModule } from './hd-customer-routing.module';
import { HdCustomerComponent } from './hd-customer.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TinymceModule} from 'angular2-tinymce';

@NgModule({
  declarations: [HdCustomerComponent],
  imports: [
    CommonModule,
    HdCustomerRoutingModule,
   ThemeSharedModule,
    NgbModule,
    TinymceModule
  ]
})
export class HdCustomerModule { }
