import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdDashboardRoutingModule } from './hd-dashboard-routing.module';
import { HdDashboardComponent } from './hd-dashboard.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [
    HdDashboardComponent,
  ],
  imports: [
    CommonModule,
    HdDashboardRoutingModule,
   ThemeSharedModule,
  ]
})
export class HdDashboardModule { }
