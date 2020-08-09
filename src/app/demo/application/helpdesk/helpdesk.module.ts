import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpdeskRoutingModule } from './helpdesk-routing.module';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HelpdeskRoutingModule,
   ThemeSharedModule,
  ]
})
export class HelpdeskModule { }
