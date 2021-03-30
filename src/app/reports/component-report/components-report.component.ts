import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ReportService} from "@app/reports/report.service";
import {ScrollStateService} from "@app/shared/scroll-state.service";
import {compareByName} from "@app/shared/compare-utils";
import {uniqueElements, uniqueObjects} from "@app/shared/array-utils";
import { Entity } from '@app/models';

@Component({
    selector: 'app-component-report',
    templateUrl: './components-report.component.html',
    styleUrls: ['./components-report.component.scss']
})
export class ComponentsReportComponent implements OnInit {

    @Input()
    displayDataOnly: false;

    reportDate = new Date();

    nameFilter: string;
    typeFilter = 'ALL';
    severityFilter = 'ALL';
    fixFilter = 'ALL';

    previewStateOpen = false;

    totals = {entities: 0, licenses: 0, components: 0, vulnerabilities: 0};
    entities: Entity[];


    /*
      -   name
      -   Entity
      -   Component
      -   Version
      -   Vulnerabilities(quantitative summary)
      -   Source(Dependency, Static(found in html or file), Codeprint
      -   License
     */
    columns = ['Component', 'Group', 'Version', 'Internal', 'Licenses', 'Vulnerabilities', 'Source'];


    constructor(
        private reportService: ReportService,
        private scrollDisableService: ScrollStateService
    ) {
    }


    ngOnInit() {
        this.reportService.getComponents().subscribe(data => {
            this.entities = data.data.entities.edges.map((e) => e.node).sort(compareByName);
            let licenses = [];

            this.totals = {entities: 0, licenses: 0, components: 0, vulnerabilities: 0};

            for (const entity of this.entities) {
                this.totals.entities += 1;
                // entity.licenses = [];
                for (const component of entity.entityComponents.edges.map(e => e.node)) {
                    this.totals.components += 1;

                    if (component.entityComponentLicenses.edges.length > 0) {
                        component.licenses = uniqueObjects(component.entityComponentLicenses.edges.map(e => e.node.name), "licenseId");
                        licenses = licenses.concat(component.licenses);
                    }
                    else {
                        component.licenses = [];
                    }

                    this.totals.vulnerabilities += component.entityComponentVulnerabilities.edges.length;
                }
            }

            this.totals.licenses = uniqueElements(licenses).length;

        }, error => {
            console.error("ComponentReportComponent", error);
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
