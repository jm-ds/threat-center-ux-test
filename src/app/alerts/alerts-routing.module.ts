import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "@app/security/helpers";
import {ExecutiveReportComponent} from "@app/reports/executive-report/executive-report.component";
import {VulnerabilitiesReportComponent} from "@app/reports/vulnerability-report/vulnerabilities-report.component";
import {LicensesReportComponent} from "@app/reports/license-report/licenses-report.component";
import {ComponentsReportComponent} from "@app/reports/component-report/components-report.component";
import {EmbeddedAssetsReportComponent} from "@app/reports/embedded-asset-report/embedded-assets-report.component";
import {SoftwareLeaksReportComponent} from "@app/reports/software-leaks-report/software-leaks-report.component";
import {AlertsComponent} from "@app/alerts/alerts/alerts.component";
import {AlertsSettingsComponent} from "@app/alerts/alerts-settings/alerts-settings.component";


const routes: Routes = [
    {
        path: '',
        // component: AlertsComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: {auth: "REPORT_VIEW"},
        children: [
            {
                path: 'list',
                component: AlertsComponent
            },
            {
                // canActivate: [AuthGuard],
                // data: {auth: "REPORT_VIEW"},
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
