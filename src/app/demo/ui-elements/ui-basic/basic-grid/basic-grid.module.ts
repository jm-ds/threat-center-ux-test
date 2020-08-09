import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicGridRoutingModule } from './basic-grid-routing.module';
import { BasicGridComponent } from './basic-grid.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BasicGridRoutingModule,
   ThemeSharedModule
  ],
  declarations: [BasicGridComponent]
})
export class BasicGridModule { }
