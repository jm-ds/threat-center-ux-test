import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TblBasicRoutingModule } from './tbl-basic-routing.module';
import { TblBasicComponent } from './tbl-basic.component';
import {ThemeSharedModule} from '../../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [TblBasicComponent],
  imports: [
    CommonModule,
    TblBasicRoutingModule,
   ThemeSharedModule,
  ]
})
export class TblBasicModule { }
