import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PellWysiwygRoutingModule } from './pell-wysiwyg-routing.module';
import { PellWysiwygComponent } from './pell-wysiwyg.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {PellModule} from 'angular-pell';
import {TinymceModule} from 'angular2-tinymce';

@NgModule({
  imports: [
    CommonModule,
    PellWysiwygRoutingModule,
   ThemeSharedModule,
    PellModule
  ],
  declarations: [PellWysiwygComponent]
})
export class PellWysiwygModule { }
