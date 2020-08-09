import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    GalleryRoutingModule,
   ThemeSharedModule,
  ],
  declarations: []
})
export class GalleryModule { }
