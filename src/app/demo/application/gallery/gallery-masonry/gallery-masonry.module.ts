import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryMasonryRoutingModule } from './gallery-masonry-routing.module';
import { GalleryMasonryComponent } from './gallery-masonry.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    GalleryMasonryRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [GalleryMasonryComponent]
})
export class GalleryMasonryModule { }
