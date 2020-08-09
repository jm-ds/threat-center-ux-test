import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrmAdvanceRoutingModule } from './frm-advance-routing.module';
import { FrmAdvanceComponent } from './frm-advance.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {TagInputModule} from 'ngx-chips';

@NgModule({
  imports: [
    CommonModule,
    FrmAdvanceRoutingModule,
   ThemeSharedModule,
    TagInputModule
  ],
  declarations: [FrmAdvanceComponent]
})
export class FrmAdvanceModule { }
