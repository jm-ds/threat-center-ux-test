import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/threat-center/shared/services/api.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FixService} from "@app/threat-center/dashboard/project/services/fix.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreHelperService} from '@app/core/services/core-helper.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FixComponentDialogComponent} from "@app/threat-center/dashboard/project/fix-component-dialog/fix-component-dialog.component";
import { FixResult, Scan } from '@app/models';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: []
})
export class ComponentsComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;
    fixResultObservable: Observable<FixResult[]>;
    newVersion: string;

    defaultPageSize = 25;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    componentDetails: any;

    columns = [
        { field: 'name', header: 'Name' },
        { field: 'group', header: 'Group' },
        { field: 'version', header: 'Version' },
        { field: 'isInternal', header: 'Internal' },
        { field: 'location', header: 'Location' },
        { field: 'license.name', header: 'Licenses' },
        { field: 'vulnerabilities', header: 'Vulnerabilities' },
        { field: 'componentType', header: 'Type' },
        { field: 'discoveryMethod', header: 'Discovery' }
    ];

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;

    constructor(
        private apiService: ApiService,
        private fixService: FixService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        console.log("scanId:", this.scanId);
        console.log("Loading ComponentsComponent");
        this.checkScanDataExists();
        this.defaultPageSize = this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components");
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        if (!this.obsScan) {
            this.obsScan = this.apiService.getScanComponents(this.scanId, this.makeFilterMapForService(), Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")))
                .pipe(map(result => result.data.scan));
            this.initData();
        } else {
            this.initData();
        }
    }

    fixVersion(componentId: string, oldVersion: string) {
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
        if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
            // page size changed...
            this.defaultPageSize = pageInfo.pageSize;
            //Setting item per page into session..
            this.coreHelperService.settingUserPreference("Project", null, null, { componentName: "Components", value: pageInfo.pageSize });
            // API Call
            this.loadComponentData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")), undefined, undefined, undefined);
            this.paginator.firstPage();
        } else {
            // Next and Previous changed
            if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
                // call with after...
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasNextPage']) {
                    this.loadComponentData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")), undefined,
                        this.componentDetails.components.pageInfo['endCursor'], undefined);
                }
            } else {
                // call with before..
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasPreviousPage']) {
                    this.loadComponentData(undefined, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")),
                        undefined, this.componentDetails.components.pageInfo['startCursor']);
                }
            }
        }
    }

    // Loading Component data after paggination for scan tab.
    loadComponentData(first, last, endCursor = undefined, startCursor = undefined) {
        let component = this.apiService.getScanComponents(this.scanId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));
        component.subscribe(component => {
            this.componentDetails = component;
        });
    }

    // goto detail Page
    gotoDetails(cId) {
        const entityId = this.route.snapshot.paramMap.get('entityId');
        const projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/component/" + cId;
        this.router.navigate([decodeURIComponent(url)]);
    }

    filterData(pattern) {
        console.log("Pattern: " + pattern);
    }

    filterColumn(column, value) {
        if (value.length === 0) {
            this.columnsFilter.delete(column);
        } else {
            this.columnsFilter.set(column, value);
        }
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.obsScan = this.apiService.getScanComponents(this.scanId, this.makeFilterMapForService(), Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")))
                .pipe(map(result => result.data.scan));
            this.initData();
        }, this.timeOutDuration);
    }

    getColumnFilterValue(key) {
        let value = this.columnsFilter.get(key);
        if (value === undefined) {
            if (key === 'Internal' || key === 'Vulnerabilities' || key === 'Location' || key === 'Type' || key === 'Discovery') {
                return 'ALL';
            } else {
                return '';
            }
        } else {
            return value;
        }
    }

    private makeFilterMapForService() {
        let compString = '';
        this.columnsFilter.forEach((val, key) => {
            compString += key + ":" + val + ",";
        });
        return compString;
    }

    // initializing data
    private initData() {
        this.obsScan.subscribe(component => {
            this.componentDetails = component;
        });
    }

    public releaseCols = ['Name', 'Version'];
    public releases = [
        { version: '2.12.1', date: 'Jan 09, 2021' },
        { version: '2.12.0', date: 'Nov 29, 2020' },
        { version: '2.12.0-rc2', date: 'Nov 15, 2020' },
        { version: '2.12.0-rc1', date: 'Oct 12, 2020' },
        { version: '2.11.4', date: 'Dec 12, 2020' },
        { version: '2.11.3', date: 'Oct 02, 2020' },
        { version: '2.11.2', date: 'Aug 02, 2020' },
        { version: '2.11.1', date: 'Jun 25, 2020' },
        { version: '2.11.0', date: 'Apr 26, 2020' },
        { version: '2.11.0.rc1', date: 'Mar 24, 2020' },
        { version: '2.10.5.1', date: 'Dec 02, 2020' },
        { version: '2.10.5', date: 'Jul 21, 2020' },
        { version: '2.10.4', date: 'May 03, 2020' },
        { version: '2.10.3', date: 'Mar 03, 2020' },
        { version: '2.10.2', date: 'Jan 05, 2020' },
        { version: '2.10.1', date: 'Nov 09, 2019' },
        { version: '2.10.0', date: 'Sep 26, 2019' },
        { version: '2.10.0.pr3', date: 'Sep 17, 2019' },
        { version: '2.10.0.pr2', date: 'Aug 31, 2019' },
        { version: '2.10.0.pr1', date: 'Jul 19, 2019' },
        { version: '2.9.10.8', date: 'Jan 06, 2021' },
        { version: '2.9.10.7', date: 'Dec 02, 2020' },
        { version: '2.9.10.6', date: 'Aug 25, 2020' },
        { version: '2.9.10.5', date: 'Jun 22, 2020' },
        { version: '2.9.10.4', date: 'Apr 11, 2020' },
    ];
}
