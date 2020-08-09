import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicToastsRoutingModule } from './basic-toasts-routing.module';
import { BasicToastsComponent } from './basic-toasts.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [BasicToastsComponent],
  imports: [
    CommonModule,
    BasicToastsRoutingModule,
   ThemeSharedModule,
  ]
})
export class BasicToastsModule { }
