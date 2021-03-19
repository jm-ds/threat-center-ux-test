import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith, timeout } from 'rxjs/operators';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { TxComponent, VulnerableRelease, VulnerableReleaseResponseMap, VulnerableReleaseResponse } from '@app/threat-center/shared/models/types';
import { ApiService, StateService } from '@app/threat-center/shared/services';
import { MatPaginator } from '@angular/material';
import { CoreHelperService } from '@app/core/services/core-helper.service';

import { VulnerableCodeMappingService } from '@app//threat-center/dashboard/project/services/vulncode-mapping.service';
import { LazyLoadEvent, Table } from "primeng";

@Component({
  selector: 'component-detail',
  templateUrl: './component-detail.component.html',
  styles: []
})
export class ComponentDetailComponent implements OnInit {

  obsComponent: Observable<TxComponent>;
  vulnerabilityColumns = ['Vulnerability', 'Cwe', 'Severity', 'CVSS2', 'CVSS3'];

  releaseCols = ['Version', 'Release Date'];

  binaryLoading: boolean;
  binaryReleases: VulnerableRelease[] = [];
  binaryRepositoryType: string;
  binaryPurlType: string;
  binaryGroup: string;
  binaryName: string;
  binaryNextPagingState: string;

  sourceLoading: boolean;
  sourceReleases: VulnerableRelease[] = [];
  sourceRepositoryType: string;
  sourcePurlType: string;
  sourceGroup: string;
  sourceName: string;
  sourceNextPagingState: string;

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
    private coreHelperService: CoreHelperService,
    private vulnerableCodeMappingService: VulnerableCodeMappingService,
    private changeDetector: ChangeDetectorRef) { }

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

    this.vulnerableCodeMappingService.startVulnerabilitiesWithCvssV3(componentId).subscribe((data: VulnerableReleaseResponseMap) => {

      this.binaryLoading = true;
      this.binaryReleases = data.binaryVulnerableResponse.vulnerableReleases;
      this.binaryRepositoryType = data.binaryVulnerableResponse.repositoryType;
      this.binaryPurlType = data.binaryVulnerableResponse.purlType;
      this.binaryGroup = data.binaryVulnerableResponse.group;
      this.binaryName = data.binaryVulnerableResponse.name;
      this.binaryNextPagingState = data.binaryVulnerableResponse.nextPagingState;

      this.sourceLoading = true;
      this.sourceReleases = data.sourceVulnerableResponse.vulnerableReleases;
      this.sourceRepositoryType = data.sourceVulnerableResponse.repositoryType;
      this.sourcePurlType = data.sourceVulnerableResponse.purlType;
      this.sourceGroup = data.sourceVulnerableResponse.group;
      this.sourceName = data.sourceVulnerableResponse.name;
      this.sourceNextPagingState = data.sourceVulnerableResponse.nextPagingState;

      console.log('>>>>> binaryReleases length = ' + this.binaryReleases.length);
      console.log('>>>>> sourceReleases length = ' + this.sourceReleases.length);
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

  loadBinaryReleasesLazy(event: LazyLoadEvent) {
    this.binaryLoading = true;
    if (this.binaryNextPagingState != null) {
      setTimeout(() => {
        this.vulnerableCodeMappingService.nextVulnerabilitiesWithCvssV3(
            this.binaryNextPagingState, this.binaryRepositoryType, this.binaryPurlType, this.binaryGroup, this.binaryName)
            .subscribe((data: VulnerableReleaseResponse) => {
              this.binaryReleases.push(...data.vulnerableReleases);
              this.binaryReleases = [...this.binaryReleases];
              this.binaryNextPagingState = data.nextPagingState;
            });
        this.changeDetector.detectChanges();
      }, 2000);
    }
    this.binaryLoading = false;
  }

  loadSourceReleasesLazy(event: LazyLoadEvent) {
    this.sourceLoading = true;
    if (this.sourceNextPagingState != null) {
      setTimeout(() => {
        this.vulnerableCodeMappingService.nextVulnerabilitiesWithCvssV3(
            this.sourceNextPagingState, this.sourceRepositoryType, this.sourcePurlType, this.sourceGroup, this.sourceName)
            .subscribe((data: VulnerableReleaseResponse) => {
              this.sourceReleases.push(...data.vulnerableReleases);
              this.sourceReleases = [...this.sourceReleases];
              this.sourceNextPagingState = data.nextPagingState;
            });
        this.changeDetector.detectChanges();
      }, 2000);
    }
    this.sourceLoading = false;
  }
}
