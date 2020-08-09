import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeStaticRoutingModule } from './theme-static-routing.module';
import { ThemeStaticComponent } from './theme-static.component';
import {CommonContentModule} from '../common-content/common-content.module';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [ThemeStaticComponent],
  imports: [
    CommonModule,
    ThemeStaticRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeStaticModule { }
