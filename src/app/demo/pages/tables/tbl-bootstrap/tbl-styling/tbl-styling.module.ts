import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TblStylingRoutingModule } from './tbl-styling-routing.module';
import { TblStylingComponent } from './tbl-styling.component';
import {ThemeSharedModule} from '../../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [TblStylingComponent],
  imports: [
    CommonModule,
    TblStylingRoutingModule,
   ThemeSharedModule,
  ]
})
export class TblStylingModule { }
