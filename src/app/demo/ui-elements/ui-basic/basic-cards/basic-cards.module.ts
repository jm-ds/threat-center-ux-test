import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicCardsRoutingModule } from './basic-cards-routing.module';
import { BasicCardsComponent } from './basic-cards.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BasicCardsRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [BasicCardsComponent]
})
export class BasicCardsModule { }
