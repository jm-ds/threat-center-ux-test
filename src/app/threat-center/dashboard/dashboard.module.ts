import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {ThemeSharedModule} from '../../theme/shared/theme-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import {TableModule} from 'primeng/table';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ThemeSharedModule,
    SharedModule,
    TableModule
  ],
  declarations: []
})
export class DashboardModule { }
