import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrtApexRoutingModule } from './crt-apex-routing.module';
import { CrtApexComponent } from './crt-apex.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [CrtApexComponent],
  imports: [
    CommonModule,
    CrtApexRoutingModule,
   ThemeSharedModule,
  ]
})
export class CrtApexModule { }
