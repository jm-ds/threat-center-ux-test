import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { UserPreferenceService } from '@app/core/services/user-preference.service';
import { Scan } from '@app/models';
import {ApiService} from '@app/threat-center/shared/services/api.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styles: []
})
export class LicensesComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;

    columns = ['Name', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];

    defaultPageSize = 25;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    licensesDetails: any;

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;

    constructor(private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private userPreferenceService:UserPreferenceService) {
    }

    ngOnInit() {
        console.log("Loading LicensesComponent for scanId: ", this.scanId);
        this.checkScanDataExists();
        this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses");
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        if (!this.obsScan) {
            this.obsScan = this.apiService.getScanLicenses(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")))
                .pipe(map(result => result.data.scan));

            this.initData();
        } else {
            this.initData();
        }
    }

    // While any changes occurred in page
    changePage(pageInfo) {
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
                if (!!this.licensesDetails.licenses.pageInfo && this.licensesDetails.licenses.pageInfo.hasNextPage) {
                    this.loadLicensesData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")), undefined,
                        this.licensesDetails.licenses.pageInfo.endCursor, undefined);
                }
            } else {
                // call with before..
                if (!!this.licensesDetails.licenses.pageInfo && this.licensesDetails.licenses.pageInfo.hasPreviousPage) {
                    this.loadLicensesData(undefined, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")),
                        undefined, this.licensesDetails.licenses.pageInfo.startCursor);
                }
            }
        }
    }

    // Loading Licenses data after paggination for scan tab.
    loadLicensesData(first, last, endCursor = undefined, startCursor = undefined) {
        let licenses = this.apiService.getScanLicenses(this.scanId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));

        licenses.subscribe(license => {
            this.licensesDetails = license;
        });

    }

    // goto detail Page
    gotoDetails(lId) {
        const entityId = this.route.snapshot.paramMap.get('entityId'),
            projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId;
        this.router.navigate([decodeURIComponent(url)]);
    }

    filterColumn(column, value) {
        if (value.length === 0) {
            this.columnsFilter.delete(column);
        } else {
            this.columnsFilter.set(column, value);
        }
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.obsScan = this.apiService.getScanLicenses(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")))
                .pipe(map(result => result.data.scan));
            this.initData();
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
        });
    }

}
