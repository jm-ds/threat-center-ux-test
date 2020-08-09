import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicAlertRoutingModule } from './basic-alert-routing.module';
import { BasicAlertComponent } from './basic-alert.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BasicAlertRoutingModule,
   ThemeSharedModule
  ],
  declarations: [BasicAlertComponent]
})
export class BasicAlertModule { }
