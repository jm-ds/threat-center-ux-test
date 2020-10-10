import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RoleListComponent} from "@app/admin/rbac/role-list/role-list.component";
import {RoleShowComponent} from "@app/admin/rbac/role-show/role-show.component";
import {RoleEditComponent} from "@app/admin/rbac/role-edit/role-edit.component";


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
                component: RoleListComponent
            },
            {
                path: 'show/:roleId',
                component: RoleShowComponent
            },
            {
                path: 'create',
                component: RoleEditComponent,
                pathMatch: 'full'
            },
            {
                path: 'edit/:roleId',
                component: RoleEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RbacRoutingModule {
}
