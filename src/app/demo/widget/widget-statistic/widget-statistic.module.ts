import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetStatisticRoutingModule } from './widget-statistic-routing.module';
import { WidgetStatisticComponent } from './widget-statistic.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [WidgetStatisticComponent],
  imports: [
    CommonModule,
    WidgetStatisticRoutingModule,
   ThemeSharedModule,
    CarouselModule,
    NgbProgressbarModule,
    NgbDropdownModule
  ]
})
export class WidgetStatisticModule { }
