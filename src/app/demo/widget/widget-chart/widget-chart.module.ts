import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetChartRoutingModule } from './widget-chart-routing.module';
import { WidgetChartComponent } from './widget-chart.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {BarRatingModule} from 'ngx-bar-rating';

@NgModule({
  declarations: [WidgetChartComponent],
  imports: [
    CommonModule,
    WidgetChartRoutingModule,
   ThemeSharedModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    BarRatingModule
  ]
})
export class WidgetChartModule { }
