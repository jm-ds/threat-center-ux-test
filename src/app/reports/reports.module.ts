import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {ExecutiveReportComponent} from './executive-report/executive-report.component';
import {VulnerabilitiesReportComponent} from './vulnerability-report/vulnerabilities-report.component';
import {LicensesReportComponent} from './license-report/licenses-report.component';
import {ComponentsReportComponent} from './component-report/components-report.component';
import {EmbeddedAssetsReportComponent} from './embedded-asset-report/embedded-assets-report.component';
import {IcDatepickerModule} from "ic-datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {TreeviewI18n, TreeviewModule} from "ngx-treeview";
import {EntityTreeviewI18n} from "./ngx-treeview-i18n";
import {SelectModule} from "ng-select";
import {AlertModule, CardModule} from "@app/theme/shared/components";
import {MessageModule, TableModule} from "primeng";
import { EntityTreeFilterComponent } from './filters/entity-tree-select/entity-tree-filter.component';
import { DateIntervalFilterComponent } from './filters/date-interval-filter/date-interval-filter.component';
import { SoftwareLeaksReportComponent } from './software-leaks-report/software-leaks-report.component';
import {NouisliderModule} from "ng2-nouislider";

@NgModule({
    declarations: [
        ExecutiveReportComponent, VulnerabilitiesReportComponent, LicensesReportComponent,
        ComponentsReportComponent, EmbeddedAssetsReportComponent, EntityTreeFilterComponent, DateIntervalFilterComponent,
        SoftwareLeaksReportComponent
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        IcDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        TreeviewModule.forRoot(),
        SelectModule,
        CardModule,
        TableModule,
        MessageModule,
        AlertModule,
        NouisliderModule
    ],
    exports: [
        DateIntervalFilterComponent,
        EntityTreeFilterComponent
    ],
    providers: [
        {provide: TreeviewI18n, useClass: EntityTreeviewI18n},
    ]
})
export class ReportsModule {
}
