import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserListComponent} from "@app/admin/user/user-list/user-list.component";
import {UserShowComponent} from "@app/admin/user/user-show/user-show.component";
import {UserRolesComponent} from "@app/admin/user/user-roles/user-roles.component";
import {UserEditComponent} from "@app/admin/user/user-edit/user-edit.component";
import {AuthGuard} from "@app/security/helpers";


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
                data: {auth: ["USER_VIEW"]}
            },
            {
                path: 'edit/:username',
                component: UserEditComponent,
                data: {auth: ["USER EDIT"]}
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
