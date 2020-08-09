import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TblSizingRoutingModule } from './tbl-sizing-routing.module';
import { TblSizingComponent } from './tbl-sizing.component';
import {ThemeSharedModule} from '../../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [TblSizingComponent],
  imports: [
    CommonModule,
    TblSizingRoutingModule,
   ThemeSharedModule,
  ]
})
export class TblSizingModule { }
