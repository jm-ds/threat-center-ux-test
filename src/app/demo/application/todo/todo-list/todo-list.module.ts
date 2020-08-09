import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoListRoutingModule } from './todo-list-routing.module';
import {TodoListComponent} from './todo-list.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  imports: [
    CommonModule,
    TodoListRoutingModule,
   ThemeSharedModule,
  ],
  declarations: [TodoListComponent]
})
export class TodoListModule { }
