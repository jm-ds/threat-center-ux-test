import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TblBootstrapRoutingModule } from './tbl-bootstrap-routing.module';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    TblBootstrapRoutingModule,
   ThemeSharedModule,
  ],
  declarations: []
})
export class TblBootstrapModule { }
