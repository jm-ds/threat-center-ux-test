import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TcSharedModule} from "@app/threat-center/shared/tc-shared.module";
import {AngularDualListBoxModule} from "angular-dual-listbox";
import {FormsModule} from "@angular/forms";
import {AlertModule} from "@app/theme/shared/components";
import { SharedModule } from '@app/shared/shared.module';
import {CardModule} from "@app/theme/shared/components";
import {DropdownModule} from 'primeng/dropdown';
import { InviteRoutingModule } from './invite-routing.module';
import { InviteShowComponent } from './invite-show/invite-show.component';





@NgModule({
  declarations: [InviteShowComponent],
    imports: [
        CommonModule,
        SharedModule,
        InviteRoutingModule,
        TcSharedModule,
        CardModule,
        AngularDualListBoxModule,
        FormsModule,
        AlertModule,
        DropdownModule
    ]
})
export class InviteModule { }
