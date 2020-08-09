import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailInboxRoutingModule } from './mail-inbox-routing.module';
import { MailInboxComponent } from './mail-inbox.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [MailInboxComponent],
  imports: [
    CommonModule,
    MailInboxRoutingModule,
   ThemeSharedModule,
    NgbCollapseModule,
    NgbDropdownModule
  ]
})
export class MailInboxModule { }
