import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { Scan, ScanComponentEdge } from '@app/models';
import { CoreHelperService } from "@app/services/core/core-helper.service";
import { UserPreferenceService } from "@app/services/core/user-preference.service";
import { FixService } from "@app/services/fix.service";
import { ProjectService } from "@app/services/project.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FixComponentDialogComponent } from "../../fix-component-dialog/fix-component-dialog.component";
import { LicenseDialogComponent } from "../../licenses-common-dialog/license-dialog.component";
import * as _ from 'lodash';
import { NextConfig } from "@app/app-config";
import { AuthenticationService } from "@app/security/services";

@Component({
    selector: 'app-component-new-cad',
    templateUrl: './new-component-card.component.html',
    styleUrls: ['./new-component-card.component.scss']
})

export class NewComponentCardComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;
    newVersion: string;

    defaultPageSize = NextConfig.config.defaultItemPerPage;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    componentDetails: any;

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;
    isDisablePaggination: boolean = false;

    isInternal = false;
    isVul = false;
    isFix: boolean = false;
    constructor(private projectService: ProjectService,
        private fixService: FixService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private modalService: NgbModal,
        private userPreferenceService: UserPreferenceService,
        private authService: AuthenticationService,
    ) { }
    ngOnInit(): void {
        console.log("scanId:", this.scanId);
        console.log("Loading ComponentsComponent");
        this.checkScanDataExists();
        this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components");
    }

    updateDataOnSelectedScan(obsScan, scanId) {
        this.obsScan = obsScan;
        this.scanId = scanId;
        this.initData();
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        this.isDisablePaggination = true;
        // if (!this.obsScan) {
        this.obsScan = this.projectService.getScanComponents(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")))
            .pipe(map(result => result.data.scan));
        this.initData();
        // } else {
        //     this.initData();
        // }
    }

    fixVersion(componentId: string, oldVersion: string) {
        console.log("fix");
        this.isFix = true;
        const modalRef = this.modalService.open(FixComponentDialogComponent, {
            keyboard: false,
        });
        modalRef.componentInstance.scanId = this.scanId;
        modalRef.componentInstance.newVersion = this.newVersion;
        modalRef.componentInstance.oldVersion = oldVersion;
        modalRef.componentInstance.componentId = componentId;
    }

    // While any changes occurred in page
    changePage(pageInfo) {
        this.isDisablePaggination = true;
        if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
            // page size changed...
            this.defaultPageSize = pageInfo.pageSize;
            //Setting item per page into session..
            this.userPreferenceService.settingUserPreference("Project", null, null, { componentName: "Components", value: pageInfo.pageSize });
            // API Call
            this.loadComponentData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")), undefined, undefined, undefined);
            this.paginator.firstPage();
        } else {
            // Next and Previous changed
            if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
                // call with after...
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasNextPage']) {
                    this.loadComponentData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")), undefined,
                        this.componentDetails.components.pageInfo['endCursor'], undefined);
                }
            } else {
                // call with before..
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasPreviousPage']) {
                    this.loadComponentData(undefined, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")),
                        undefined, this.componentDetails.components.pageInfo['startCursor']);
                }
            }
        }
    }

  /** Sort components */
  private sortComponents() {
    this.componentDetails.components.edges.sort((a: ScanComponentEdge, b: ScanComponentEdge) => {
      const aName = this.getComponentName(a);
      const bName = this.getComponentName(b);

      return aName.localeCompare(bName);
    });
  }

    // Loading Component data after paggination for scan tab.
    loadComponentData(first, last, endCursor = undefined, startCursor = undefined) {
        let component = this.projectService.getScanComponents(this.scanId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));
        component.subscribe(component => {
            this.componentDetails = component;
            this.isDisablePaggination = false;

            this.sortComponents();
        });
    }

    // goto detail Page
    gotoDetails(cId) {
        if (this.isFix) {
            this.isFix = false;
            return;
        }
        console.log("goto");
        const entityId = this.route.snapshot.paramMap.get('entityId');
        const projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/component/" + cId;
        this.router.navigate([decodeURIComponent(url)]);
    }

    filterData(pattern) {
        console.log("Pattern: " + pattern);
    }

    /**
     * Filter by columm
     *
     * @param column column name
     * @param event input event
     * @param idElement element ID
     */
    onFilterColumn(column: string, event: Event, idElement: string = '') {
        let { value } = event.target as HTMLInputElement | HTMLSelectElement;

        if (column === 'Internal') {
            this.isInternal = !this.isInternal;
            value = this.isInternal ? 'TRUE' : '';
        }

        if (column === 'Vulnerabilities') {
            this.isVul = !this.isVul;
            value = this.isVul ? 'TRUE' : '';
        }

        if (value.length === 0) {
            this.columnsFilter.delete(column);
        } else {
            this.columnsFilter.set(column, value);
        }
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            const scnObj = this.projectService.getScanComponents(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")))
                .pipe(map(result => result.data.scan));
            scnObj.subscribe(component => {
                this.componentDetails = component;
                if (!!idElement && idElement !== '') {
                    this.coreHelperService.setFocusOnElement(idElement);
                }
            });
        }, this.timeOutDuration);
    }

    getColumnFilterValue(key) {
        let value = this.columnsFilter.get(key);
        if (value === undefined) {
            if (key === 'Vulnerabilities' || key === 'Location' || key === 'Type' || key === 'Discovery') {
                return 'ALL';
            } else {
                return '';
            }
        } else {
            return value;
        }
    }

    getTootltipValue(key) {
        return this.getColumnFilterValue(key) !== 'ALL' ? this.getColumnFilterValue(key) : '';
    }

    gotoLicense(selectedData) {
        const modalRef = this.modalService.open(LicenseDialogComponent, { size: 'lg' });
        modalRef.componentInstance.selectedLicenseDetail = { name: selectedData.name, licensesList: selectedData.licenses['edges'] };
    }

    getComponentName(componentData) {
        return !!componentData.node && componentData.node.group ? componentData.node.group + ':' + componentData.node.name + '@' + componentData.node.version : componentData.node.name + '@' + componentData.node.version;
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

    getMaxServity(vulnerabilities) {
        const groupByValue = _.chain(vulnerabilities.edges).groupBy("node.severity")
            .map((value, key) => ({ key: key, value: value })).value();
        if (groupByValue.length >= 1) {
            return this.checkMaxANdReturnKeyhelper(groupByValue);
        } else {
            return '';
        }
    }

    isUserSCMAccountExists() {
        return !!this.authService.currentUser.repositoryAccounts && !!this.authService.currentUser.repositoryAccounts
            && (!!this.authService.currentUser.repositoryAccounts.bitbucketAccount ||
                !!this.authService.currentUser.repositoryAccounts.githubAccount ||
                !!this.authService.currentUser.repositoryAccounts.gitlabAccount);
    }

    private checkMaxANdReturnKeyhelper(groupByValue) {
        const val = groupByValue.reduce((max, obj) => (max.value.length >= obj.value.length) ? max : obj);
        const critical = groupByValue.find(a => { return a.key === 'CRITICAL' });
        const high = groupByValue.find(a => { return a.key === 'HIGH' });
        const medium = groupByValue.find(a => { return a.key === 'MEDIUM' });
        const low = groupByValue.find(a => { return a.key === 'LOW' });
        const info = groupByValue.find(a => { return a.key === 'INFO' });

        if (!!critical) {
            if (critical.value.length >= val.value.length) {
                return critical.key;
            }
        }
        if (!!high) {
            if (high.value.length >= val.value.length) {
                return high.key;
            }
        }
        if (!!medium) {
            if (medium.value.length >= val.value.length) {
                return medium.key;
            }
        }

        if (!!low) {
            if (low.value.length >= val.value.length) {
                return low.key;
            }
        }
        if (!!info) {
            if (info.value.length >= val.value.length) {
                return info.key;
            }
        } else {
            return ''
        }
    }

    private makeFilterMapForService() {
        let compString = '';
        this.columnsFilter.forEach((val, key) => {
            compString += key + ":" + val + ",";
        });
        return compString;
    }

  /** Initialize components data */
  private initData() {
    this.obsScan.subscribe(component => {
      this.isDisablePaggination = false;
      this.componentDetails = component;

      this.sortComponents();
    });
  }
}