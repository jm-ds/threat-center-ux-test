import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';

import {LicenseAssetAttribution, Scan} from '@app/models';

import { NextConfig } from '@app/app-config';

import { CoreHelperService } from '@app/services/core/core-helper.service';
import { UserPreferenceService } from '@app/services/core/user-preference.service';
import { ProjectService } from '@app/services/project.service';
import { AuthenticationService } from '@app/security/services';
import { AlertService } from "@app/services/core/alert.service";

@Component({
    selector: 'app-license-new-card',
    templateUrl: './new-license-card.component.html',
    styleUrls: ['./new-license-card.component.scss']
})


export class NewLicenseCardComponent implements OnInit {
    @Input() scanId;
    @Input() obsScan: Observable<Scan>;
    @Output() annotateClick = new EventEmitter();

    defaultPageSize = NextConfig.config.defaultItemPerPage;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    licensesDetails: any;

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;
    isDisablePaggination: boolean = false;

    totalLicenses: number = 0;
    pageInfo: any;
    constructor(
        private alertService: AlertService,
        private projectService: ProjectService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private userPreferenceService: UserPreferenceService,
        private authService: AuthenticationService) {

    }
    ngOnInit(): void {
        console.log("Loading LicensesComponent for scanId: ", this.scanId);
        this.checkScanDataExists();
        this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses");
    }

    updateDataOnSelectedScan(obsScan,scanId){
        this.obsScan = obsScan;
        this.scanId = scanId;
        this.initData();
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        this.isDisablePaggination = true;
        // if (!this.obsScan) {
        this.obsScan = this.projectService.getScanLicenses(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Licenses")))
            .pipe(map(result => result.data.scan));

        this.initData();
        // } else {
        //     this.initData();
        // }
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
      const licenses = this.projectService.getScanLicenses(
        this.scanId,
        this.makeFilterMapForService(),
        first,
        last,
        endCursor,
        startCursor
      )
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
    gotoDetails(lId, licenseDiscovery, licenseOrigin, isAsset: boolean = false) {
        const entityId = this.route.snapshot.paramMap.get('entityId'),
            projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId + "/discovery/" + licenseDiscovery + "/origin/" + licenseOrigin;
        if (isAsset) {
            this.router.navigate([decodeURIComponent(url)], { queryParams: { isAsset: 'Yes' } });
        } else {
            this.router.navigate([decodeURIComponent(url)]);
        }

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
            if (key === 'LicenseDiscovery' || key === 'Category') {
                return 'ALL';
            } else {
                return '';
            }

        } else {
            return value;
        }
    }

    getTrustLevelValue(level) {
        let val = '';
        switch (level) {
            case 'LEVEL_1':
                val = 'Repository license';
                break;
            case 'LEVEL_2':
                val = 'Context relevant license';
                break;
            default:
                break;
        }
        return val;
    }

  onAnnotate(event: MouseEvent, licenseID: string, ignore: boolean, attributeProcessExecuteMessageModel) {
    event.stopImmediatePropagation();
    attributeProcessExecuteMessageModel.show();
    this.projectService.attributeAssetsByLicense(this.scanId, licenseID, ignore).subscribe(result => {
        attributeProcessExecuteMessageModel.hide();
        // example: result.data.attributeAssetsByLicense.attributionStatus
        const attribution: LicenseAssetAttribution = result.data['attributeAssetsByLicense'];
        this.alertService.alertBox('Attribution is successful: ' + attribution.attributionStatus, 'License attribution', 'success');
    }, (error) => {
        attributeProcessExecuteMessageModel.hide();
        this.alertService.alertBox('Attribution error', 'License attribution', 'error');
    });
  }

    attributeProcessExecutionModel(modelContent) {
        this.alertService.alertConfirm(
            'Do you want to close dialog?',
            'You can close modal, attribution process will complete. But if you leave this page you won’t get ' +
            'completion notification message.',
            'question',
            true,
            true,
            '#4680ff',
            '#6c757d',
            'Yes',
            'No')
            .then((result) => {
                if (result.value) {
                    modelContent.hide();
                }
            });
    }

    isUserSCMAccountExists() {
        return !!this.authService.currentUser.repositoryAccounts && !!this.authService.currentUser.repositoryAccounts
            && (!!this.authService.currentUser.repositoryAccounts.bitbucketAccount ||
                !!this.authService.currentUser.repositoryAccounts.githubAccount ||
                !!this.authService.currentUser.repositoryAccounts.gitlabAccount);
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
            this.isDisablePaggination = false;
            this.licensesDetails = licenses;
            this.totalLicenses = this.licensesDetails.licenses.totalCount;
            this.pageInfo = this.licensesDetails.licenses.pageInfo;
            this.calculateLogic();
        });
    }

    private calculateLogic() {
        this.licensesDetails = _.chain(this.licensesDetails.licenses.edges).groupBy("node.name")
            .map((value, key) => ({ key: key, value: value })).value();
        this.totalLicenses = this.licensesDetails.length;
        // console.log(value);
        // let originalArray = [];
        // _.each(value, mainValue => {

        //     if (mainValue.value.length >= 2) {
        //         originalArray.push({ isColspan: true, name: mainValue.key });
        //         _.each(mainValue.value, val => {
        //             originalArray.push({
        //                 isColspan: false,
        //                 node: {
        //                     trustLevel: val.node.trustLevel,
        //                     category: val.node.category,
        //                     isFsfLibre: val.node.isFsfLibre,
        //                     isOsiApproved: val.node.isOsiApproved,
        //                     licenseDiscovery: val.node.licenseDiscovery,
        //                     licenseId: val.node.licenseId,
        //                     licenseOrigin: val.node.licenseOrigin,
        //                     name: '',
        //                     publicationYear: val.node.publicationYear,
        //                     spdxId: val.node.spdxId,
        //                     style: val.node.style,
        //                     type: val.node.type,
        //                     isColspan: false
        //                 }
        //             });
        //         });
        //     } else {
        //         _.each(mainValue.value, val => {
        //             originalArray.push(
        //                 {
        //                     isColspan: false,
        //                     node: {
        //                         trustLevel: val.node.trustLevel,
        //                         category: val.node.category,
        //                         isFsfLibre: val.node.isFsfLibre,
        //                         isOsiApproved: val.node.isOsiApproved,
        //                         licenseDiscovery: val.node.licenseDiscovery,
        //                         licenseId: val.node.licenseId,
        //                         licenseOrigin: val.node.licenseOrigin,
        //                         name: val.node.name,
        //                         publicationYear: val.node.publicationYear,
        //                         spdxId: val.node.spdxId,
        //                         style: val.node.style,
        //                         type: val.node.type,
        //                         isColspan: false
        //                     }
        //                 });
        //         });
        //     }
        // });
        // this.licensesDetails = originalArray;
    }

}
