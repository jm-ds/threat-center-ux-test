import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrtHighChartRoutingModule } from './crt-high-chart-routing.module';
import { CrtHighChartComponent } from './crt-high-chart.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    CrtHighChartRoutingModule,
   ThemeSharedModule,
    AngularHighchartsChartModule,
    HttpClientModule
  ],
  declarations: [CrtHighChartComponent]
})
export class CrtHighChartModule { }
