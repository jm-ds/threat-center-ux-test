import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PolicyListComponent} from "@app/admin/policy/policy-list/policy-list.component";
import {PolicyShowComponent} from "@app/admin/policy/policy-show/policy-show.component";
import { PolicyEditComponent } from './policy-edit/policy-edit.component';

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
                component: PolicyListComponent
            },
            {
                path: 'show/:policyId',
                component: PolicyShowComponent
            },
            {
                path: 'create',
                component: PolicyEditComponent,
                pathMatch: 'full'
            },
            {
                path: 'edit/:policyId',
                component: PolicyEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PolicyRoutingModule {
}
