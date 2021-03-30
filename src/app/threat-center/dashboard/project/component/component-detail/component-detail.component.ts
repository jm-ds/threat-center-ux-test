import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith, timeout } from 'rxjs/operators';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, StateService } from '@app/threat-center/shared/services';
import { MatPaginator } from '@angular/material';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { TxComponent } from '@app/models';


@Component({
  selector: 'component-detail',
  templateUrl: './component-detail.component.html',
  styles: []
})
export class ComponentDetailComponent implements OnInit {

  obsComponent: Observable<TxComponent>;
  vulnerabilityColumns = ['Vulnerability', 'Cwe', 'Severity', 'CVSS2', 'CVSS3'];

  projectId: string = "";
  scanId: string="";
  licenseId: string="";

  defaultPageSize = 25;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  vulnerabilityDetails: any = {};

  breadcumDetail: any = {};
  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService:CoreHelperService) { }

  ngOnInit() {
    console.log("Loading ComponentDetailComponent");
    let componentId = this.route.snapshot.paramMap.get('componentId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.licenseId = this.route.snapshot.paramMap.get('licenseId');
    console.log("componentId:", componentId);
    this.obsComponent = this.apiService.getComponent(componentId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.component));

    this.obsComponent.subscribe((res: any) => {
      this.coreHelperService.settingProjectBreadcum("Component",res.name,res.componentId,false);
      this.vulnerabilityDetails = res["vulnerabilities"];
    });

    this.initBreadcum();
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

  //goto project page
  gotoProject() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  //goto license page
  gotoLicense() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId+"/scan/"+this.scanId+"/license/"+this.licenseId;
    this.router.navigate([url]);
  }

  //goto details pages
  gotoOtherDetailsPage(id, pageName: string) {
    this.coreHelperService.settingProjectBreadcum("","","",true);
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

  //Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.coreHelperService.getProjectBreadcum();
  }
}
