import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PolicyListComponent} from "./policy-list/policy-list.component";
import {PolicyShowComponent} from "./policy-show/policy-show.component";
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
                path: 'list/:entityId',
                component: PolicyListComponent
            },
            {
                path: 'list/:entityId/:projectId',
                component: PolicyListComponent
            },
            {
                path: 'show/:policyId',
                component: PolicyShowComponent
            },
            {
                path: 'show/:policyId/:entityId',
                component: PolicyShowComponent
            },
            {
                path: 'show/:policyId/:entityId/:projectId',
                component: PolicyShowComponent
            },
            {
                path: 'create',
                component: PolicyEditComponent
            },
            {
                path: 'create/:entityId',
                component: PolicyEditComponent
            },
            {
                path: 'create/:entityId/:projectId',
                component: PolicyEditComponent
            },
            {
                path: 'edit/:policyId',
                component: PolicyEditComponent
            },
            {
                path: 'edit/:policyId/:entityId',
                component: PolicyEditComponent
            },
            {
                path: 'edit/:policyId/:entityId/:projectId',
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
