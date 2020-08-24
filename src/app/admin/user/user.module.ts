import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import {CardModule} from "@app/theme/shared/components";
import {NgbTabsetModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    CardModule,
    NgbTabsetModule
  ]
})
export class UserModule { }
