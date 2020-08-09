import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdTicketRoutingModule } from './hd-ticket-routing.module';
import { HdTicketComponent } from './hd-ticket.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {TinymceModule} from 'angular2-tinymce';

@NgModule({
  declarations: [HdTicketComponent],
  imports: [
    CommonModule,
    HdTicketRoutingModule,
   ThemeSharedModule,
    TinymceModule
  ]
})
export class HdTicketModule { }
