import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvTaskBoardRoutingModule } from './adv-task-board-routing.module';
import { AdvTaskBoardComponent } from './adv-task-board.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {DragulaModule, DragulaService} from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    AdvTaskBoardRoutingModule,
   ThemeSharedModule,
    DragulaModule
  ],
  declarations: [AdvTaskBoardComponent],
  providers: [DragulaService]
})
export class AdvTaskBoardModule { }
