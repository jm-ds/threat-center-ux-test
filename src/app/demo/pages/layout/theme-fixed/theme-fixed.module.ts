import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeFixedRoutingModule } from './theme-fixed-routing.module';
import { ThemeFixedComponent } from './theme-fixed.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeFixedComponent],
  imports: [
    CommonModule,
    ThemeFixedRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeFixedModule { }
