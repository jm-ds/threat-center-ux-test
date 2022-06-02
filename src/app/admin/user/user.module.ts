import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import {AlertModule, CardModule} from "@app/theme/shared/components";
import {NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule} from "@ng-bootstrap/ng-bootstrap";
import { UserShowComponent } from './user-show/user-show.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import {AngularDualListBoxModule} from "angular-dual-listbox";
import { UserCardComponent } from './user-card/user-card.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import {TcSharedModule} from "@app/threat-center/shared/tc-shared.module";
import {FormsModule} from "@angular/forms";
import {SelectModule} from "ng-select";
import {SharedModule} from "@app/shared/shared.module";
import { ApiKeyShowComponent } from './apikey-show/apikey-show.component';
import { ApiKeyEditComponent } from './apikey-edit/apikey-edit.component';
import {UserAccountsComponent} from "@app/admin/user/user-accounts/user-accounts.component";


@NgModule({
  declarations: [UserListComponent, UserShowComponent, UserRolesComponent, UserCardComponent, UserEditComponent, ApiKeyShowComponent, ApiKeyEditComponent, UserAccountsComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        CardModule,
        NgbTabsetModule,
        NgbDropdownModule,
        AngularDualListBoxModule,
        TcSharedModule,
        AlertModule,
        FormsModule,
        SelectModule,
        SharedModule,
        NgbDatepickerModule
    ],
    exports: [ApiKeyShowComponent, ApiKeyEditComponent]
})
export class UserModule { }
