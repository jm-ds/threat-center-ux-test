import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeSharedModule} from '../../theme/shared/theme-shared.module';

import { ConditionBuilderComponent } from './condition-builder/condition-builder.component';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { PolicyShowComponent } from './policy-show/policy-show.component';
import {TcSharedModule} from "@app/threat-center/shared/tc-shared.module";
import {AngularDualListBoxModule} from "angular-dual-listbox";
import {FormsModule} from "@angular/forms";
import {AlertModule} from "@app/theme/shared/components";
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared/shared.module';
import {CardModule} from "@app/theme/shared/components";
import {TableModule} from 'primeng/table';
import { PolicyEditComponent } from './policy-edit/policy-edit.component';
import {DropdownModule} from 'primeng/dropdown';





@NgModule({
  declarations: [PolicyListComponent, PolicyShowComponent, PolicyEditComponent, ConditionBuilderComponent],
    imports: [
        CommonModule,
        SharedModule,
        PolicyRoutingModule,
        TcSharedModule,
        CardModule,
        AngularDualListBoxModule,
        FormsModule,
        AlertModule,
        NgbTabsetModule,
        ThemeSharedModule,
        TableModule,
        DropdownModule
    ]
})
export class PolicyModule { }
