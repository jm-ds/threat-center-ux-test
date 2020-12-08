import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FixResult, Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixService } from "@app/threat-center/dashboard/project/services/fix.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'components',
    templateUrl: './components.component.html',
    styles: []
})
export class ComponentsComponent implements OnInit {

    @Input() scanId;
    @Input() obsScan: Observable<Scan>;
    fixResultObservable: Observable<FixResult>;
    newVersion: string;

    defaultPageSize = 25;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    componentDetails: any;

    columns = [
        { field: 'name', header: 'Name' },
        { field: 'group', header: 'Group' },
        { field: 'version', header: 'Version' },
        { field: 'isInternal', header: 'Internal' },
        { field: 'disc', header: 'Source' },
        { field: 'license.name', header: 'Licenses' },
        { field: 'vulnerabilities', header: 'Vulnerabilities' },
    ];

    constructor(private apiService: ApiService, private fixService: FixService, private spinner: NgxSpinnerService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        console.log("scanId:", this.scanId);
        console.log("Loading ComponentsComponent");
        if (!this.obsScan) {
            this.obsScan = this.apiService.getScanComponents(this.scanId, Number(this.defaultPageSize))
                .pipe(map(result => result.data.scan));
            this.initData();
        } else {
            this.initData();
        }

    }

    fixVersion(groupId: string, artifactId: string) {
        this.spinner.show();
        this.fixResultObservable = this.fixService.fixComponentVersion(this.scanId, groupId, artifactId, this.newVersion.split("||")[1]);
        this.fixResultObservable.subscribe(res => {
            this.spinner.hide();
            if (res) {
                Swal.fire('Good job!', 'Mvn dependency version updated!', 'success');
            } else {
                Swal.fire('Error!', 'Something went wrong, try later!', 'warning');
            }
        });
    }

    //While any changes occurred in page
    changePage(pageInfo) {
        if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
            //page size changed...
            this.defaultPageSize = pageInfo.pageSize;
            //API Call
            this.loadComponentData(Number(this.defaultPageSize), undefined, undefined, undefined);
            this.paginator.firstPage();
        }
        else {
            //Next and Previous changed
            if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
                //call with after...
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasNextPage']) {
                    this.loadComponentData(Number(this.defaultPageSize), undefined,
                        this.componentDetails.components.pageInfo['endCursor'], undefined);
                }
            } else {
                //call with before..
                if (!!this.componentDetails.components.pageInfo && this.componentDetails.components.pageInfo['hasPreviousPage']) {
                    this.loadComponentData(undefined, Number(this.defaultPageSize),
                        undefined, this.componentDetails.components.pageInfo['startCursor']);
                }
            }
        }
    }

    //Loading Component data after paggination for scan tab.
    loadComponentData(first, last, endCursor = undefined, startCursor = undefined) {
        let component = this.apiService.getScanComponents(this.scanId, first, last, endCursor, startCursor)
            .pipe(map(result => result.data.scan));
        component.subscribe(component => {
            this.componentDetails = component;
        });
    }

    //goto detail Page
    gotoDetails(cId) {
        const entityId = this.route.snapshot.paramMap.get('entityId'), projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/component/" + cId;
        this.router.navigate([decodeURIComponent(url)]);
    }

    //initializing data
    private initData(){
        this.obsScan.subscribe(component => {
            this.componentDetails = component;
        });
    }
}
