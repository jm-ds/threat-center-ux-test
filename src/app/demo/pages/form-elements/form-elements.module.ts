import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormElementsRoutingModule } from './form-elements-routing.module';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormElementsRoutingModule,
   ThemeSharedModule,
  ],
  declarations: []
})
export class FormElementsModule { }
