import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskDetailRoutingModule } from './task-detail-routing.module';
import { TaskDetailComponent } from './task-detail.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TaskDetailRoutingModule,
   ThemeSharedModule,
    NgbDropdownModule
  ],
  declarations: [TaskDetailComponent]
})
export class TaskDetailModule { }
