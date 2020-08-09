import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvAlertRoutingModule } from './adv-alert-routing.module';
import { AdvAlertComponent } from './adv-alert.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdvAlertRoutingModule,
   ThemeSharedModule
  ],
  declarations: [AdvAlertComponent]
})
export class AdvAlertModule { }
