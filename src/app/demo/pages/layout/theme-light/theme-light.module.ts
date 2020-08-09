import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeLightRoutingModule } from './theme-light-routing.module';
import { ThemeLightComponent } from './theme-light.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeLightComponent],
  imports: [
    CommonModule,
    ThemeLightRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeLightModule { }
