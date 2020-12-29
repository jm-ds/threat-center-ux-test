import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationSettingComponent } from './setting/org-setting.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OrganizationSettingComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationSettingRoutingModule {
}
