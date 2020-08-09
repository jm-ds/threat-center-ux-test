import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicCarouselRoutingModule } from './basic-carousel-routing.module';
import { BasicCarouselComponent } from './basic-carousel.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BasicCarouselRoutingModule,
   ThemeSharedModule,
    NgbCarouselModule
  ],
  declarations: [BasicCarouselComponent]
})
export class BasicCarouselModule { }
