import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeRtlHRoutingModule } from './theme-rtl-h-routing.module';
import { ThemeRtlHComponent } from './theme-rtl-h.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeRtlHComponent],
  imports: [
    CommonModule,
    ThemeRtlHRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeRtlHModule { }
