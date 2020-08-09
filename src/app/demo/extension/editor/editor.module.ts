import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    EditorRoutingModule,
   ThemeSharedModule,
  ],
  declarations: []
})
export class EditorModule { }
