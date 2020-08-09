import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullEventCalendarRoutingModule } from './full-event-calendar-routing.module';
import { FullEventCalendarComponent } from './full-event-calendar.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {FormsModule} from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    FullEventCalendarRoutingModule,
   ThemeSharedModule,
    FullCalendarModule,
    FormsModule
  ],
  declarations: [FullEventCalendarComponent],
  providers: []
})
export class FullEventCalendarModule { }
