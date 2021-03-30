import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ScrollStateService} from "@app/shared/scroll-state.service";
import {compareByName} from "@app/shared/compare-utils";
import {ReportService} from "@app/reports/report.service";
import {log} from "util";
import {uniqueElements, uniqueObjects} from "@app/shared/array-utils";
import { Entity } from '@app/models';

@Component({
    selector: 'app-license-report',
    templateUrl: './licenses-report.component.html',
    styleUrls: ['./licenses-report.component.scss']
})
export class LicensesReportComponent implements OnInit {

    @Input()
    displayDataOnly: false;

    reportDate = new Date();

    nameFilter: string;
    typeFilter = 'ALL';
    styleFilter = 'ALL';
    categoryFilter = 'ALL';
    previewStateOpen = false;

    totals = {entities: 0, licenses: 0};
    entities: Entity[];

/*
-   Name
-   Type
-   family
-   Style
-   Risk score
*/
    // columns = ['Name', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];
    columns = ['Name', 'Type', 'Family', 'Category', 'Style'/*, 'Risk score'*/];

    constructor(
        private reportService: ReportService,
        private scrollDisableService: ScrollStateService
    ) {}

    ngOnInit() {
        this.reportService.getLicenses().subscribe(data => {
            this.entities = data.data.entities.edges.map((e) => e.node).sort(compareByName);

            this.totals = {entities: 0, licenses: 0};

            let licenses = [];

            for (const entity of this.entities) {
                this.totals.entities += 1;
                entity.licenses = [];
                for (const component of entity.entityComponents.edges.map(e => e.node)) {
                    if (component.entityComponentLicenses.edges.length > 0) {
                        entity.licenses = entity.licenses.concat(component.entityComponentLicenses.edges.map(e => e.node));
                    }
                }

                // remove duplicates
                entity.licenses = uniqueObjects(entity.licenses, "licenseId");

                licenses = licenses.concat(entity.licenses);
            }
            this.totals.licenses = uniqueObjects(licenses, "licenseId").length;

        }, error => {
            console.error("LicenseReportComponent", error);
        });
    }

    openPreview() {
        this.previewStateOpen = true;
        this.scrollDisableService.disableWindowScroll();
    }

    closePreview() {
        this.previewStateOpen = false;
        this.scrollDisableService.enableWindowScroll();
    }

    @HostListener('window:keydown', ['$event'])
    KeyDown(event: KeyboardEvent) {
        if (!this.displayDataOnly && event.keyCode === 27) {
            this.closePreview();
            event.stopPropagation();
            event.preventDefault();
        }
    }

}
