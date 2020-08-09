import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicButtonRoutingModule } from './basic-button-routing.module';
import { BasicButtonComponent } from './basic-button.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BasicButtonRoutingModule,
   ThemeSharedModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule
  ],
  declarations: [BasicButtonComponent]
})
export class BasicButtonModule { }
