import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrtPeityRoutingModule } from './crt-peity-routing.module';
import { CrtPeityComponent } from './crt-peity.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    CrtPeityRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [CrtPeityComponent]
})
export class CrtPeityModule { }
