import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicModalRoutingModule } from './basic-modal-routing.module';
import { BasicModalComponent } from './basic-modal.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BasicModalRoutingModule,
   ThemeSharedModule,
    NgbPopoverModule,
    NgbTooltipModule
  ],
  declarations: [BasicModalComponent]
})
export class BasicModalModule { }
