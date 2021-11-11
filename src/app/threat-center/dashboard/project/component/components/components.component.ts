import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreHelperService} from '@app/services/core/services/core-helper.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FixComponentDialogComponent} from "@app/threat-center/dashboard/project/fix-component-dialog/fix-component-dialog.component";
import {Scan} from '@app/models';
import {UserPreferenceService} from '@app/services/core/services/user-preference.service';
import { ProjectService } from '@app/services/project.service';
import { FixService } from '@app/services/fix.service';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: []
})
export class ComponentsComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;
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
        { field: 'componentType', header: 'Type' },
        { field: 'discoveryMethod', header: 'Discovery' },
        { field: 'license.name', header: 'Licenses' },
        { field: 'vulnerabilities', header: 'Vulnerabilities' }
    ];

    columnsFilter = new Map();
    timeOut;
    timeOutDuration = 1000;
    isDisablePaggination:boolean = false;

    constructor(
        // private apiService: ApiService,
        private projectService:ProjectService,
        private fixService: FixService,
        private router: Router,
        private route: ActivatedRoute,
        private coreHelperService: CoreHelperService,
        private modalService: NgbModal,
        private userPreferenceService:UserPreferenceService) {
    }

    ngOnInit() {
        console.log("scanId:", this.scanId);
        console.log("Loading ComponentsComponent");
        this.checkScanDataExists();
        this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components");
    }

    //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
    checkScanDataExists() {
        if (!this.obsScan) {
            this.obsScan = this.projectService.getScanComponents(this.scanId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Components")))
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

    // Loading Component data after paggination for scan tab.
    loadComponentData(first, last, endCursor = undefined, startCursor = undefined) {
        let component = this.projectService.getScanComponents(this.scanId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));
        component.subscribe(component => {
            this.componentDetails = component;
            this.isDisablePaggination = false;
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

    filterColumn(column, value,idElement:string = '') {
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
                this.coreHelperService.setFocusOnElement(idElement);
            });
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
}
