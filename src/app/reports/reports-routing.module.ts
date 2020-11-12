import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "@app/security/helpers";
import {ExecutiveReportComponent} from "@app/reports/executive-report/executive-report.component";
import {VulnerabilitiesReportComponent} from "@app/reports/vulnerability-report/vulnerabilities-report.component";
import {LicensesReportComponent} from "@app/reports/license-report/licenses-report.component";
import {ComponentsReportComponent} from "@app/reports/component-report/components-report.component";
import {EmbeddedAssetsReportComponent} from "@app/reports/embedded-asset-report/embedded-assets-report.component";
import {SoftwareLeaksReportComponent} from "@app/reports/software-leaks-report/software-leaks-report.component";


const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        data: {auth: "REPORT_VIEW"},
        children: [
            {
                path: 'executive',
                component: ExecutiveReportComponent
            },
            {
                path: 'vulnerability',
                component: VulnerabilitiesReportComponent
            },
            {
                path: 'license',
                component: LicensesReportComponent
            },
            {
                path: 'component',
                component: ComponentsReportComponent
            },
            {
                path: 'embedded',
                component: EmbeddedAssetsReportComponent
            },
            {
                path: 'leaks',
                component: SoftwareLeaksReportComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule {
}
