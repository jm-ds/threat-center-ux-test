import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeHorizontalRoutingModule } from './theme-horizontal-routing.module';
import { ThemeHorizontalComponent } from './theme-horizontal.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeHorizontalComponent],
  imports: [
    CommonModule,
    ThemeHorizontalRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeHorizontalModule { }
