import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicBadgeRoutingModule } from './basic-badge-routing.module';
import { BasicBadgeComponent } from './basic-badge.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BasicBadgeRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [BasicBadgeComponent]
})
export class BasicBadgeModule { }
