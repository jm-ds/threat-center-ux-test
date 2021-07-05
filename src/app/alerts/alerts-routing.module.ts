import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "@app/security/helpers";
import {AlertsComponent} from "@app/alerts/alerts/alerts.component";
import {AlertsSettingsComponent} from "@app/alerts/alerts-settings/alerts-settings.component";


const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: {auth: "REPORT_VIEW"},
        children: [
            {
                path: 'list',
                component: AlertsComponent
            },
            {
                path: 'settings',
                component: AlertsSettingsComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlertsRoutingModule {
}
