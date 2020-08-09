import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtTinymceRoutingModule } from './ext-tinymce-routing.module';
import { ExtTinymceComponent } from './ext-tinymce.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {TinymceModule} from 'angular2-tinymce';

@NgModule({
  imports: [
    CommonModule,
    ExtTinymceRoutingModule,
   ThemeSharedModule,
    TinymceModule
  ],
  declarations: [ExtTinymceComponent]
})
export class ExtTinymceModule { }
