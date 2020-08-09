import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {ThemeSharedModule} from '../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ThemeSharedModule,
  ]
})
export class DashboardModule { }
