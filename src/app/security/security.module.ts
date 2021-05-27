import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { FormsModule }    from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import {CreateAccountComponent} from '@app/security/create-account/create-account.component';
import { AwaitingApprovalComponent } from './awaiting-approval/awaiting-approval.component';
import {AlertModule} from "@app/theme/shared/components";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    imports: [
        CommonModule,
        SecurityRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AlertModule,
        NgbPopoverModule
    ],
  declarations: [
      LoginComponent,
      CreateAccountComponent,
      AwaitingApprovalComponent
  ]
})
export class SecurityModule { }
