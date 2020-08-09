import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicTabsPillsRoutingModule } from './basic-tabs-pills-routing.module';
import { BasicTabsPillsComponent } from './basic-tabs-pills.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BasicTabsPillsRoutingModule,
   ThemeSharedModule,
    NgbTabsetModule
  ],
  declarations: [BasicTabsPillsComponent]
})
export class BasicTabsPillsModule { }
