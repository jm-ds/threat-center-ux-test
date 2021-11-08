import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { UserPreferenceService } from '@app/core/services/user-preference.service';
import { Scan } from '@app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Messages } from "@app/messages/messages";
import * as _ from 'lodash';
import { ProjectService } from '@app/services/project.service';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styles: []
})
export class LicensesComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;

    columns = ['Name', /*'ID', */'Discovery', 'Origin', 'Trust Level', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];

    defaultPageSize = 25;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    licensesDetails: any;

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;
    isDisablePaggination:boolean = false;

    messages = Messages;
    totalLicenses:number = 0;
    pageInfo:any;

    constructor(
        private projectService:ProjectService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private userPreferenceService: UserPreferenceService) {
    }

    ngOnInit() {
        console.log("Loading LicensesComponent for scanId: ", this.scanId);
        this.checkScanDataExists();
        this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses");
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        if (!this.obsScan) {
            this.obsScan = this.projectService.getScanLicenses(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")))
                .pipe(map(result => result.data.scan));

            this.initData();
        } else {
            this.initData();
        }
    }

    // While any changes occurred in page
    changePage(pageInfo) {
        this.isDisablePaggination = true;
        if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
            // page size changed...
            this.defaultPageSize = pageInfo.pageSize;
            //Setting item per page into session..
            this.userPreferenceService.settingUserPreference("Project", null, null, { componentName: "Licenses", value: pageInfo.pageSize });
            // API Call
            this.loadLicensesData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")), undefined, undefined, undefined);
            this.paginator.firstPage();
        } else {
            // Next and Previous changed
            if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
                // call with after...
                if (!!this.pageInfo && this.pageInfo) {
                    this.loadLicensesData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")), undefined,
                        this.pageInfo.endCursor, undefined);
                }
            } else {
                // call with before..
                if (!!this.pageInfo && this.pageInfo.hasPreviousPage) {
                    this.loadLicensesData(undefined, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")),
                        undefined, this.pageInfo.startCursor);
                }
            }
        }
    }

    // Loading Licenses data after paggination for scan tab.
    loadLicensesData(first, last, endCursor = undefined, startCursor = undefined) {
        let licenses = this.projectService.getScanLicenses(this.scanId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));

        licenses.subscribe(license => {
            this.licensesDetails = license;
            this.isDisablePaggination = false;
            this.totalLicenses = this.licensesDetails.licenses.totalCount;
            this.pageInfo = this.licensesDetails.licenses.pageInfo;
            this.calculateLogic();
        });

    }

    // goto detail Page
    gotoDetails(lId, licenseDiscovery, licenseOrigin) {
        const entityId = this.route.snapshot.paramMap.get('entityId'),
            projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId+"/discovery/"+licenseDiscovery+"/origin/"+licenseOrigin;
        this.router.navigate([decodeURIComponent(url)]);
    }

    filterColumn(column, value, idElement: string = '') {
        if (value.length === 0) {
            this.columnsFilter.delete(column);
        } else {
            this.columnsFilter.set(column, value);
        }
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            const obsScan = this.projectService.getScanLicenses(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")))
                .pipe(map(result => result.data.scan));

            obsScan.subscribe(licenses => {
                this.licensesDetails = licenses;
                this.coreHelperService.setFocusOnElement(idElement);
                this.totalLicenses = this.licensesDetails.licenses.totalCount;
                this.pageInfo = this.licensesDetails.licenses.pageInfo;
                this.calculateLogic();
            });
        }, this.timeOutDuration);
    }

    getColumnFilterValue(key) {
        let value = this.columnsFilter.get(key);
        if (value === undefined) {
            return '';
        } else {
            return value;
        }
    }

    private makeFilterMapForService() {
        let filterString = '';
        this.columnsFilter.forEach((val, key) => {
            filterString += key + ":" + val + ",";
        });
        return filterString;
    }

    // initializing data
    private initData() {
        this.obsScan.subscribe(licenses => {
            this.licensesDetails = licenses;
            this.totalLicenses = this.licensesDetails.licenses.totalCount;
            this.pageInfo = this.licensesDetails.licenses.pageInfo;
            this.calculateLogic();
        });
    }

    private calculateLogic() {
        const value = _.chain(this.licensesDetails.licenses.edges).groupBy("node.name")
            .map((value, key) => ({ key: key, value: value })).value();
        let originalArray = [];
        _.each(value, mainValue => {

            if (mainValue.value.length >= 2) {
                originalArray.push({ isColspan: true, name: mainValue.key });
                _.each(mainValue.value, val => {
                    originalArray.push({
                        isColspan: false,
                        node: {
                            trustLevel: val.node.trustLevel,
                            category: val.node.category,
                            isFsfLibre: val.node.isFsfLibre,
                            isOsiApproved: val.node.isOsiApproved,
                            licenseDiscovery: val.node.licenseDiscovery,
                            licenseId: val.node.licenseId,
                            licenseOrigin: val.node.licenseOrigin,
                            name: '',
                            publicationYear: val.node.publicationYear,
                            spdxId: val.node.spdxId,
                            style: val.node.style,
                            type: val.node.type,
                            isColspan: false
                        }
                    });
                });
            } else {
                _.each(mainValue.value, val => {
                    originalArray.push(
                        {
                            isColspan: false,
                            node: {
                                trustLevel: val.node.trustLevel,
                                category: val.node.category,
                                isFsfLibre: val.node.isFsfLibre,
                                isOsiApproved: val.node.isOsiApproved,
                                licenseDiscovery: val.node.licenseDiscovery,
                                licenseId: val.node.licenseId,
                                licenseOrigin: val.node.licenseOrigin,
                                name: val.node.name,
                                publicationYear: val.node.publicationYear,
                                spdxId: val.node.spdxId,
                                style: val.node.style,
                                type: val.node.type,
                                isColspan: false
                            }
                        });
                });
            }
        });
        this.licensesDetails = originalArray;
    }
}
