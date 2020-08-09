import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryGridRoutingModule } from './gallery-grid-routing.module';
import { GalleryGridComponent } from './gallery-grid.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    GalleryGridRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [GalleryGridComponent]
})
export class GalleryGridModule { }
