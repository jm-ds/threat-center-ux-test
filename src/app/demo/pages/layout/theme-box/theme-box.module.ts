import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeBoxRoutingModule } from './theme-box-routing.module';
import { ThemeBoxComponent } from './theme-box.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeBoxComponent],
  imports: [
    CommonModule,
    ThemeBoxRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeBoxModule { }
