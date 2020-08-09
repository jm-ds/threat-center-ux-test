import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeDarkRoutingModule } from './theme-dark-routing.module';
import { ThemeDarkComponent } from './theme-dark.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeDarkComponent],
  imports: [
    CommonModule,
    ThemeDarkRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeDarkModule { }
