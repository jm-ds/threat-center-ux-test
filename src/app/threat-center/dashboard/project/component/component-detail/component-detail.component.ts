import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith, timeout } from 'rxjs/operators';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { Scan, License, TxComponent } from '@app/threat-center/shared/models/types';
import { ApiService, StateService } from '@app/threat-center/shared/services';
import { MatPaginator } from '@angular/material';


@Component({
  selector: 'component-detail',
  templateUrl: './component-detail.component.html',
  styles: []
})
export class ComponentDetailComponent implements OnInit {

  obsComponent: Observable<TxComponent>;
  vulnerabilityColumns = ['Vulnerability', 'Cwe', 'Severity', 'CVSS2', 'CVSS3'];

  projectId: string = "";

  defaultPageSize = 25;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  vulnerabilityDetails: any = {};

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log("Loading ComponentDetailComponent");
    let componentId = this.route.snapshot.paramMap.get('componentId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log("componentId:", componentId);
    this.obsComponent = this.apiService.getComponent(componentId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.component));

    this.obsComponent.subscribe((res: any) => {
      this.vulnerabilityDetails = res["vulnerabilities"];
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.component_tabs_selectedTab = $event.nextId;
    setTimeout(() => {
      if(!!this.paginator){
        this.paginator.pageIndex = this.pageIndex;
      }
    }, 1000);
  }

  public releaseCols = ['Name', 'Version'];
  public releases = [
    { version: 'v1.4.3-RELEASE', date: '05/20/2020' },
    { version: 'v1.4.2-RELEASE', date: '05/01/2020' },
    { version: 'v1.4.1-RELEASE', date: '04/13/2020' },
    { version: 'v1.4.0-RELEASE', date: '04/01/2020' },
    { version: 'v1.4.0-RC5', date: '03/02/2020' },
    { version: 'v1.4.0-RC4', date: '02/10/2020' },
    { version: 'v1.4.0-RC3', date: '01/21/2020' },
    { version: 'v1.4.0-RC2', date: '01/01/2020' },
    { version: 'v1.4.3-RC1', date: '12/25/2019' },
    { version: 'v1.3.9-RELEASE', date: '11/15/2019' },
  ];

  //goto project page
  gotoProject() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  //goto details pages
  gotoOtherDetailsPage(id, pageName: string) {
    const entityId = this.route.snapshot.paramMap.get('entityId'),
      projectId = this.route.snapshot.paramMap.get('projectId'),
      scanId = this.route.snapshot.paramMap.get('scanId');
    let url = "";
    if (pageName === 'vulnerability') {
      url = !!scanId ? "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + scanId + "/vulnerability/" + id :
        "dashboard/entity/" + entityId + '/project/' + projectId + "/vulnerability/" + id;
    } else {
      url = !!scanId ? "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + scanId + "/license/" + id :
        "dashboard/entity/" + entityId + '/project/' + projectId + "/license/" + id;
    }
    this.router.navigate([decodeURIComponent(url)]);

  }


  //While any changes occurred in page
  changePage(pageInfo) {
    this.pageIndex = pageInfo.pageIndex;
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      //page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //API Call
      this.loadVulData(Number(this.defaultPageSize), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      //Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        //call with after...
        if (!!this.vulnerabilityDetails.pageInfo && this.vulnerabilityDetails.pageInfo['hasNextPage']) {
          this.loadVulData(Number(this.defaultPageSize), undefined,
            this.vulnerabilityDetails.pageInfo['endCursor'], undefined);
        }
      } else {
        //call with before..
        if (!!this.vulnerabilityDetails.pageInfo && this.vulnerabilityDetails.pageInfo['hasPreviousPage']) {
          this.loadVulData(undefined, Number(this.defaultPageSize),
            undefined, this.vulnerabilityDetails.pageInfo['startCursor']);
        }
      }
    }
  }

  //Loading vulnerability data after paggination.
  private loadVulData(first, last, endCursor = undefined, startCursor = undefined) {
    let componentId = this.route.snapshot.paramMap.get('componentId');
    let vulnerability = this.apiService.getComponent(componentId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.component));
    vulnerability.subscribe(res => {
      this.vulnerabilityDetails = res["vulnerabilities"];
    });
  }

}
