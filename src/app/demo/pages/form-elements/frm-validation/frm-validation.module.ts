import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrmValidationRoutingModule } from './frm-validation-routing.module';
import { FrmValidationComponent } from './frm-validation.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CustomFormsModule} from 'ng2-validation';

@NgModule({
  imports: [
    CommonModule,
    FrmValidationRoutingModule,
   ThemeSharedModule,
    CustomFormsModule
  ],
  declarations: [FrmValidationComponent]
})
export class FrmValidationModule { }
