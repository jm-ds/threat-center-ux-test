import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { VulnerableRelease, VulnerableReleaseResponseMap, VulnerableReleaseResponse } from '@app/threat-center/shared/models/types';

import { CoreHelperService } from '@app/services/core/core-helper.service';
import { ProjectBreadcumsService } from '@app/services/core/project-breadcums.service';
import { ProjectService } from '@app/services/project.service';
import { ScanComponentService } from '@app/services/scan-component.service';
import { VulnerableCodeMappingService } from '@app/services/vulncode-mapping.service';
import { StateService } from '@app/services/state.service';

import { TxComponent } from '@app/models';

@Component({
  selector: 'component-detail',
  templateUrl: './component-detail.component.html',
  styles: []
})
export class ComponentDetailComponent implements OnInit {

  obsComponent: Observable<TxComponent>;
  component: TxComponent;
  obsScanComponent: Observable<TxComponent>;
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
  sourcePurlType: string = "";
  sourceGroup: string;
  sourceName: string;
  sourceNextPagingState: string;

  projectId: string = "";
  scanId: string = "";
  licenseId: string = "";

  defaultPageSize = 25;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('perfectScrollSourceRelese', { static: false }) perfectScrollSourceRelese: PerfectScrollbarComponent;
  @ViewChild('perfectScrollBinaryRelese', { static: false }) perfectScrollBinaryRelese: PerfectScrollbarComponent;

  vulnerabilityDetails: any = {};

  breadcumDetail: any = {};
  licensesList = [];
  columns = ['Name', 'Discovery', 'Origin', 'Trust Level', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];
  constructor(
    private projectService: ProjectService,
    private scanComponentService: ScanComponentService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService,
    private vulnerableCodeMappingService: VulnerableCodeMappingService,
    private changeDetector: ChangeDetectorRef,
    private projectBreadcumsService: ProjectBreadcumsService) { }

  ngOnInit() {
    console.log("Loading ComponentDetailComponent");
    let componentId = this.route.snapshot.paramMap.get('componentId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.licenseId = this.route.snapshot.paramMap.get('licenseId');
    console.log("componentId:", componentId);
    /*this.obsComponent = this.apiService.getComponent(componentId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.component));*/
    this.obsScanComponent = this.scanComponentService.getScanComponent(this.scanId, componentId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.scanComponent));

    this.obsScanComponent.subscribe((res: any) => {

      this.component = res["component"];
      this.calculateLogic(res);
      if (!!this.projectBreadcumsService.getProjectBreadcum()) {
        this.projectBreadcumsService.settingProjectBreadcum("Component", res.name, res.componentId, false);
      }
      this.vulnerabilityDetails = res["component"]["vulnerabilities"];
    });

    this.vulnerableCodeMappingService.startVulnerabilitiesWithCvssV3(componentId).subscribe((data: VulnerableReleaseResponseMap) => {

      this.binaryLoading = true;
      if (data.binaryVulnerableResponse !== undefined) {
        this.binaryReleases = data.binaryVulnerableResponse.vulnerableReleases;
        this.binaryRepositoryType = data.binaryVulnerableResponse.repositoryType;
        this.binaryPurlType = data.binaryVulnerableResponse.purlType;
        this.binaryGroup = data.binaryVulnerableResponse.group;
        this.binaryName = data.binaryVulnerableResponse.name;
        this.binaryNextPagingState = data.binaryVulnerableResponse.nextPagingState;
      }

      if (data.sourceVulnerableResponse !== undefined) {
        this.sourceLoading = true;
        this.sourceReleases = data.sourceVulnerableResponse.vulnerableReleases;
        this.sourceRepositoryType = data.sourceVulnerableResponse.repositoryType;
        this.sourcePurlType = data.sourceVulnerableResponse.purlType;
        this.sourceGroup = data.sourceVulnerableResponse.group;
        this.sourceName = data.sourceVulnerableResponse.name;
        this.sourceNextPagingState = data.sourceVulnerableResponse.nextPagingState;
      }

      console.log('>>>>> binaryReleases length = ' + this.binaryReleases.length);
      console.log('>>>>> sourceReleases length = ' + this.sourceReleases.length);
    });

    this.initBreadcum();
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.component_tabs_selectedTab = $event.nextId;
    setTimeout(() => {
      if (!!this.paginator) {
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
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId + "/scan/" + this.scanId + "/license/" + this.licenseId;
    this.router.navigate([url]);
  }

  //goto details pages
  gotoOtherDetailsPage(id, pageName: string) {
    if (!!this.projectBreadcumsService.getProjectBreadcum()) {
      this.projectBreadcumsService.settingProjectBreadcum("", "", "", true);
    }
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

  // goto license detail Page
  gotoDetails(lId, licenseDiscovery, licenseOrigin) {
    const entityId = this.route.snapshot.paramMap.get('entityId'),
      projectId = this.route.snapshot.paramMap.get('projectId');
    const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId + "/discovery/" + licenseDiscovery + "/origin/" + licenseOrigin;
    this.router.navigate([decodeURIComponent(url)]);
  }

  private calculateLogic(license) {
    const value = _.chain(license.licenses.edges).groupBy("node.name")
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

    // jdm: filter licenses for DECLARED because the other licenses seem wrong right now
    // Once we've cleaned up the license data(probably by Q1 2022), we can remove this filter.
    this.licensesList = originalArray;
    /*this.licensesList = originalArray.filter(s => {
        if (s.isColspan) {
            return false;
        }
        else {
            return s.node.licenseDiscovery === 'DECLARED' || s.node.licenseOrigin === 'REPOSITORY_META';
        }
    });*/


}

  //Loading vulnerability data after paggination.
  private loadVulData(first, last, endCursor = undefined, startCursor = undefined) {
    let componentId = this.route.snapshot.paramMap.get('componentId');
    let vulnerability = this.projectService.getComponent(componentId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.component));
    vulnerability.subscribe(res => {
      this.vulnerabilityDetails = res["vulnerabilities"];
    });
  }

  //Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.projectBreadcumsService.getProjectBreadcum();
  }

  loadBinaryReleasesLazy(event: LazyLoadEvent) {
    if (this.binaryNextPagingState != null) {
      this.vulnerableCodeMappingService.nextVulnerabilitiesWithCvssV3(
        this.binaryNextPagingState, this.binaryRepositoryType, this.binaryPurlType, this.binaryGroup, this.binaryName)
        .subscribe((data: VulnerableReleaseResponse) => {
          this.binaryReleases.push(...data.vulnerableReleases);
          this.binaryReleases = [...this.binaryReleases];
          this.binaryNextPagingState = data.nextPagingState;
          this.perfectScrollBinaryRelese.directiveRef.update();
          this.changeDetector.detectChanges();
        });
    }
  }

  loadSourceReleasesLazy(event: LazyLoadEvent) {
    if (this.sourceNextPagingState != null) {
      this.vulnerableCodeMappingService.nextVulnerabilitiesWithCvssV3(
        this.sourceNextPagingState, this.sourceRepositoryType, this.sourcePurlType, this.sourceGroup, this.sourceName)
        .subscribe((data: VulnerableReleaseResponse) => {
          this.sourceReleases.push(...data.vulnerableReleases);
          this.sourceReleases = [...this.sourceReleases];
          this.sourceNextPagingState = data.nextPagingState;
          this.perfectScrollSourceRelese.directiveRef.update();
          this.changeDetector.detectChanges();
        });
    }
  }
}
