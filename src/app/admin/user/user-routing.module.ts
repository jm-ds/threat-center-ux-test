import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserListComponent} from "@app/admin/user/user-list/user-list.component";
import {UserShowComponent} from "@app/admin/user/user-show/user-show.component";
import {UserRolesComponent} from "@app/admin/user/user-roles/user-roles.component";
import {UserEditComponent} from "@app/admin/user/user-edit/user-edit.component";
import {AuthGuard} from "@app/security/helpers";
import { ApiKeyShowComponent } from './apikey-show/apikey-show.component';
import { ApiKeyEditComponent } from './apikey-edit/apikey-edit.component';


const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: UserListComponent,
                data: {auth: "USER_VIEW"}
            },
            {
                path: 'show/:username',
                component: UserShowComponent,
                data: {auth: ["AUTHENTICATED", "USER_VIEW"]}
            },
            {
                path: 'edit/:username',
                component: UserEditComponent,
                data: {auth: ["USER_EDIT"]}
            },
            {
                path: 'create',
                component: UserEditComponent,
                data: {auth: "USER_CREATE"}
            },
            {
                path: 'roles/:username',
                component: UserRolesComponent,
                data: {auth: "USER_EDIT"}
            },
            {
                path: 'show/:username/show/apikey/:keyid',
                component: ApiKeyShowComponent,
                data: {auth: ["USER_VIEW"]}
            },
            {
                path: 'show/:username/create/apikey/:keyid',
                component: ApiKeyEditComponent,
                data: {auth: ["USER_VIEW", "USER_APITOKEN_CREATE"]}
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
