import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeRtlVRoutingModule } from './theme-rtl-v-routing.module';
import { ThemeRtlVComponent } from './theme-rtl-v.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeRtlVComponent],
  imports: [
    CommonModule,
    ThemeRtlVRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeRtlVModule { }
