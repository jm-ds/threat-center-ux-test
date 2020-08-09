import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TblBorderRoutingModule } from './tbl-border-routing.module';
import { TblBorderComponent } from './tbl-border.component';
import {ThemeSharedModule} from '../../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [TblBorderComponent],
  imports: [
    CommonModule,
    TblBorderRoutingModule,
   ThemeSharedModule,
  ]
})
export class TblBorderModule { }
