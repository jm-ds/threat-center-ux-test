import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {ThemeSharedModule} from '../../theme/shared/theme-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import {TableModule} from 'primeng/table';
import { PolicyModule } from './policy/policy.module';
import { VerticalTabComponent } from './vertical-tab/vertical-tab.component';
import { IntegrationModule } from './integration/integration.module';



@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ThemeSharedModule,
    SharedModule,
    TableModule,
    PolicyModule,
    IntegrationModule
  ],
  declarations: [VerticalTabComponent],
  exports:[VerticalTabComponent]
})
export class DashboardModule { }
