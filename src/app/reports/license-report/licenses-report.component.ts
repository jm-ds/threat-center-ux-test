import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollStateService } from "@app/shared/scroll-state.service";
import { compareByName } from "@app/shared/compare-utils";
import { log } from "util";
import { uniqueElements, uniqueObjects } from "@app/shared/array-utils";
import { Entity } from '@app/models';
import { ReportService } from '@app/services/report.service';

@Component({
    selector: 'app-license-report',
    templateUrl: './licenses-report.component.html',
    styleUrls: ['./licenses-report.component.scss']
})
export class LicensesReportComponent implements OnInit, OnDestroy {

    @Input()
    displayDataOnly: false;

    reportDate = new Date();

    nameFilter = '';
    typeFilter = '';
    styleFilter = 'ALL';
    categoryFilter = 'ALL';
    previewStateOpen = false;

    totals = { entities: 0, licenses: 0, projects: 0 };
    entities = [];

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
    ) { }
    ngOnDestroy(): void {
        if (this.previewStateOpen) {
            this.previewStateOpen = false;
            this.scrollDisableService.enableWindowScroll();
        }
    }

    ngOnInit() {
        // this.findLicenses("",'','ALL');
        this.findLicenses(this.nameFilter, this.typeFilter, this.categoryFilter);
    }

    onApplyFilter() {
        // todo: apply filter heres
        // console.log(this.entitiesSelected);
        // console.log(this.dateInterval.dateStart);
        // console.log(this.dateInterval.dateEnd);
        // console.log(this.entityTree.entitiesSelected);



        console.log("apply filter =================================================================================================");
        console.log(this.nameFilter);
        console.log(this.typeFilter);
        console.log(this.categoryFilter);

        this.findLicenses(this.nameFilter, this.typeFilter, this.categoryFilter);
    }

    onClearFilter() {
        this.nameFilter = '';
        this.typeFilter = '';
        this.categoryFilter = 'ALL';
        // this.entityTree.entitiesSelected = [];

        this.findLicenses(this.nameFilter, this.typeFilter, this.categoryFilter);
    }


    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    findLicenses(name, type, category) {
        this.reportService.findLicenses(name, type, category).subscribe(data => {

            console.log("=================================================");
            console.log(data);

            this.entities = data;

            this.totals = { entities: 0, licenses: 0, projects: 0 };

            let entities = [];

            for (const entity of this.entities) {
                // this.totals.entities += 1;
                entities.push(entity.entityId);
                this.totals.projects += 1;
                for (const license of entity.licenses) {
                    this.totals.licenses += 1;
                }
            }

            this.totals.entities = entities.filter(this.onlyUnique).length;

        }, error => {
            console.error("LicenseReportComponent", error);
        });

        /*this.reportService.getLicenses().subscribe(data => {
        http://localhost:8080/license-state-report?name=&type=ALL&category=ALL
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
        });*/
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
