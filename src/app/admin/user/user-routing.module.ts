import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserListComponent} from "@app/admin/user/user-list/user-list.component";
import {UserShowComponent} from "@app/admin/user/user-show/user-show.component";
import {UserRolesComponent} from "@app/admin/user/user-roles/user-roles.component";
import {UserEditComponent} from "@app/admin/user/user-edit/user-edit.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: UserListComponent
            },
            {
                path: 'show/:username',
                component: UserShowComponent
            },
            {
                path: 'edit/:username',
                component: UserEditComponent
            },
            {
                path: 'create',
                component: UserEditComponent
            },
            {
                path: 'roles/:username',
                component: UserRolesComponent
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
