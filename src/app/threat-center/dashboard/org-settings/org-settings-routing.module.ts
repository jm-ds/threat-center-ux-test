import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiKeyEditComponent } from '@app/admin/user/apikey-edit/apikey-edit.component';
import { ApiKeyShowComponent } from '@app/admin/user/apikey-show/apikey-show.component';
import { OrganizationSettingComponent } from './setting/org-setting.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OrganizationSettingComponent,
                pathMatch: 'full'
            },
            {
                path: ':activePanelId',
                component: OrganizationSettingComponent,
                data: {auth: ["ORG_ADMIN"]}
            },    
            {
                path: ':activePanelId/:activeTabId',
                component: OrganizationSettingComponent,
                data: {auth: ["ORG_ADMIN"]}
            },
            {
                path: 'integration/org-apikeys/show/apikey/:keyid',
                component: ApiKeyShowComponent,
                data: {auth: ["ORG_ADMIN"]}
            },
            {
                path: 'integration/org-apikeys/create/apikey/:keyid',
                component: ApiKeyEditComponent,
                data: {auth: ["ORG_ADMIN", "ORG_APITOKEN_CREATE"]}
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
