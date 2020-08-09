import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicTypographyRoutingModule } from './basic-typography-routing.module';
import { BasicTypographyComponent } from './basic-typography.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BasicTypographyRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [BasicTypographyComponent]
})
export class BasicTypographyModule { }
