import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CreateAccountComponent} from '@app/security/create-account/create-account.component';
import {AwaitingApprovalComponent} from "@app/security/awaiting-approval/awaiting-approval.component";
import {FinishSignupComponent} from "@app/security/finish-signup/finish-signup.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'create-account',
                component: CreateAccountComponent
            },
            {
                path: 'finish-signup',
                component: FinishSignupComponent
            },
            {
                path: 'awaiting-approval',
                component: AwaitingApprovalComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityRoutingModule {
}
