import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbacRoutingModule } from './rbac-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleShowComponent } from './role-show/role-show.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import {TcSharedModule} from "@app/threat-center/shared/tc-shared.module";
import {AngularDualListBoxModule} from "angular-dual-listbox";
import {FormsModule} from "@angular/forms";
import {AlertModule} from "@app/theme/shared/components";


@NgModule({
  declarations: [RoleListComponent, RoleShowComponent, RoleEditComponent],
    imports: [
        CommonModule,
        RbacRoutingModule,
        TcSharedModule,
        AngularDualListBoxModule,
        FormsModule,
        AlertModule
    ]
})
export class RbacModule { }
