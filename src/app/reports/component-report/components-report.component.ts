import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollStateService } from "@app/shared/scroll-state.service";
import { compareByName } from "@app/shared/compare-utils";
import { uniqueElements, uniqueObjects } from "@app/shared/array-utils";
import { Entity } from '@app/models';
import { ReportService } from '@app/services/report.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-component-report',
    templateUrl: './components-report.component.html',
    styleUrls: ['./components-report.component.scss']
})
export class ComponentsReportComponent implements OnInit, OnDestroy {
    reportDate = new Date();

    nameFilter = '';
    versionFilter = '';
    typeFilter = '';
    severityFilter = 'ALL';
    fixFilter = 'ALL';

    locationFilter = '';
    discoveryFilter = '';

    isInternalFilter = false;
    hasVulnerabilitiesFilter = false;

    previewStateOpen = false;

    // totals = {entities: 0, projects: 0, licenses: 0, components: 0, vulnerabilities: 0};
    totals = { entities: 0, components: 0, projects: 0 };
    entities = [];


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

  @Input() displayDataOnly: boolean;

    constructor(
        private reportService: ReportService,
        private scrollDisableService: ScrollStateService
    ) {
    }
    ngOnDestroy(): void {
        if (this.previewStateOpen) {
            this.previewStateOpen = false;
            this.scrollDisableService.enableWindowScroll();
        }
    }


    getMaxServity(vulnerabilities) {
        const groupByValue = _.chain(vulnerabilities.edges).groupBy("node.severity")
            .map((value, key) => ({ key: key, value: value })).value();
        if (groupByValue.length >= 1) {
            const val = groupByValue.reduce((max, obj) => (max.value.length >= obj.value.length) ? max : obj);

            return val.key;
        } else {
            return '';
        }
    }


    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    getComponentName(componentData) {
        return !!componentData && componentData.group ? componentData.group + ':' + componentData.name + '@' + componentData.version : componentData.name + '@' + componentData.version;
    }

    getDiscoverIn(str) {
        let val = '';
        switch (str) {
            case 'DEPENDENCY_FILE':
                val = 'DEPENDENCY FILE';
                break;
            case 'DRIVE':
                val = 'DRIVE';
                break;
            case 'STATIC_REF':
                val = 'STATIC REF';
                break;
            default:
                break;
        }
        return val;
    }

    findComponents(nameFilter, versionFilter, typeFilter, locationFilter, discoveryFilter, isInternalFilter, hasVulnerabilitiesFilter) {


        console.log("=================================================================================================");
        console.log("find components");

        this.reportService.findComponentsGQL(nameFilter, versionFilter, typeFilter, locationFilter, discoveryFilter, isInternalFilter, hasVulnerabilitiesFilter).subscribe(data => {

            console.log("=================================================");
            console.log(data);

            this.entities = data.data.componentsReport;

            this.totals = { entities: 0, components: 0, projects: 0 };

            let entities = [];

            for (const entity of this.entities) {
                // this.totals.entities += 1;
                entities.push(entity.entityId);
                this.totals.projects += 1;
                for (const component of entity.comps) {
                    this.totals.components += 1;
                }
            }

            this.totals.entities = entities.filter(this.onlyUnique).length;

        }, error => {
            console.error("ComponentReportComponent", error);
        });


        /*
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
        });*/
    }

    ngOnInit() {
        this.findComponents(this.nameFilter,
            this.versionFilter,
            this.typeFilter,
            this.locationFilter,
            this.discoveryFilter,
            this.isInternalFilter,
            this.hasVulnerabilitiesFilter);
    }

    onApplyFilter() {
        // todo: apply filter heres
        // console.log(this.entitiesSelected);
        // console.log(this.dateInterval.dateStart);
        // console.log(this.dateInterval.dateEnd);
        // console.log(this.entityTree.entitiesSelected);



        console.log("apply filter =================================================================================================");
        console.log(this.nameFilter);
        console.log(this.versionFilter);
        console.log(this.typeFilter);
        console.log(this.locationFilter);
        console.log(this.discoveryFilter);
        console.log(this.isInternalFilter);
        console.log(this.hasVulnerabilitiesFilter);





        this.findComponents(this.nameFilter,
            this.versionFilter,
            this.typeFilter,
            this.locationFilter,
            this.discoveryFilter,
            this.isInternalFilter,
            this.hasVulnerabilitiesFilter);
    }

    onClearFilter() {
        this.nameFilter = '';
        this.versionFilter = '';
        this.typeFilter = '';
        this.locationFilter = '';
        this.discoveryFilter = '';
        this.isInternalFilter = false;
        this.hasVulnerabilitiesFilter = false;

        this.findComponents(this.nameFilter,
            this.versionFilter,
            this.typeFilter,
            this.locationFilter,
            this.discoveryFilter,
            this.isInternalFilter,
            this.hasVulnerabilitiesFilter);
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
