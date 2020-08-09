import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskBoardRoutingModule } from './task-board-routing.module';
import { TaskBoardComponent } from './task-board.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TaskBoardRoutingModule,
   ThemeSharedModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  declarations: [TaskBoardComponent]
})
export class TaskBoardModule { }
