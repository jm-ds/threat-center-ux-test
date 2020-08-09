import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvRatingRoutingModule } from './adv-rating-routing.module';
import { AdvRatingComponent } from './adv-rating.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {BarRatingModule} from 'ngx-bar-rating';

@NgModule({
  imports: [
    CommonModule,
    AdvRatingRoutingModule,
   ThemeSharedModule,
    BarRatingModule
  ],
  declarations: [AdvRatingComponent]
})
export class AdvRatingModule { }
