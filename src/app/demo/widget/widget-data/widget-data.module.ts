import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetDataRoutingModule } from './widget-data-routing.module';
import { WidgetDataComponent } from './widget-data.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {NgbProgressbarModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [WidgetDataComponent],
  imports: [
    CommonModule,
    WidgetDataRoutingModule,
   ThemeSharedModule,
    NgbProgressbarModule,
    NgbTabsetModule
  ]
})
export class WidgetDataModule { }
