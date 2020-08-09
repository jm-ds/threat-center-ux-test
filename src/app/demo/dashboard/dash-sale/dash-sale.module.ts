import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashSaleRoutingModule } from './dash-sale-routing.module';
import { DashSaleComponent } from './dash-sale.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [
    DashSaleComponent
  ],
  imports: [
    CommonModule,
    DashSaleRoutingModule,
   ThemeSharedModule,
  ]
})
export class DashSaleModule { }
