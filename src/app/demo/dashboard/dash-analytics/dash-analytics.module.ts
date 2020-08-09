import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashAnalyticsRoutingModule } from './dash-analytics-routing.module';
import { DashAnalyticsComponent } from './dash-analytics.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DashAnalyticsRoutingModule,
   ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule
  ],
  declarations: [
    DashAnalyticsComponent,
  ]
})
export class DashAnalyticsModule { }
