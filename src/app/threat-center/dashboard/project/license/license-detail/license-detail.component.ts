import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { ProjectBreadcumsService } from '@app/services/core/project-breadcums.service';
import { StateService } from '@app/services/state.service';


@Component({
  selector: 'license-detail',
  templateUrl: './license-detail.component.html',
  styles: []
})
export class LicenseDetailComponent implements OnInit, OnDestroy {

  //obsComponent:Observable<Component>;
  //vulnerabilityColumns = ['Vulnerability','Cwe','Severity','CVSS2','CVSS3'];

  projectId: string = ""
  scanId: string = "";
  entityId: string = "";
  constructor(
    public stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService,
    private projectBreadcumsService: ProjectBreadcumsService) { }

  licenseId: string;
  licenseDiscovery: string;
  licenseOrigin: string;

  breadcumDetail: any = {};
  licenseName: string = "";
  ngOnInit() {
    console.log("Loading LicenseDetailComponent");
    this.licenseId = this.route.snapshot.paramMap.get('licenseId');
    this.licenseDiscovery = this.route.snapshot.paramMap.get('licenseDiscovery');
    this.licenseOrigin = this.route.snapshot.paramMap.get('licenseOrigin');
    this.licenseId = this.route.snapshot.paramMap.get('licenseId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.entityId = this.route.snapshot.paramMap.get('entityId');

    /*let componentId = this.route.snapshot.paramMap.get('componentId');
    console.log("componentId:",componentId);
    this.obsComponent = this.apiService.getComponent(componentId)
    .pipe(map(result => result.data.component));*/
    this.initBreadcum();
  }

  ngOnDestroy(): void {
    if (!!this.projectBreadcumsService.getProjectBreadcum()) {
      this.projectBreadcumsService.settingProjectBreadcum("", "", "", false);
    }
  }

  //onTabChange($event: NgbTabChangeEvent) {
  //  this.stateService.component_tabs_selectedTab=$event.nextId;
  //}

  gotoProject() {
    const url = "dashboard/entity/" + this.entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  gotoComponent() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId + "/component/" + this.breadcumDetail.SelectedComponent['id'];
    if (!!this.projectBreadcumsService.getProjectBreadcum()) {
      this.projectBreadcumsService.settingProjectBreadcum("License", "", "", false);
    }
    this.router.navigate([url]);
  }

  //Getting license name after emiting
  getLicenseName(name) {
    this.licenseName = name;
    if (!!this.projectBreadcumsService.getProjectBreadcum()) {
      this.projectBreadcumsService.settingProjectBreadcum("License", this.licenseName, this.licenseId, false);
    }
  }

  //Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.projectBreadcumsService.getProjectBreadcum();
  }


}
