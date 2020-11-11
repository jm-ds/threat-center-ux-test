import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {ThemeSharedModule} from '../../theme/shared/theme-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import {TableModule} from 'primeng/table';
import { PolicyModule } from './policy/policy.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ThemeSharedModule,
    SharedModule,
    TableModule,
    PolicyModule
  ],
  declarations: []
})
export class DashboardModule { }
