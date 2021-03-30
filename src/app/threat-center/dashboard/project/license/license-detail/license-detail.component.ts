import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ApiService,StateService } from '@app/threat-center/shared/services';
import { CoreHelperService } from '@app/core/services/core-helper.service';


@Component({
  selector: 'license-detail',
  templateUrl: './license-detail.component.html',
  styles: []
})
export class LicenseDetailComponent implements OnInit,OnDestroy {

  //obsComponent:Observable<Component>;
  //vulnerabilityColumns = ['Vulnerability','Cwe','Severity','CVSS2','CVSS3'];

  projectId:string = ""
  scanId: string="";
  entityId: string="";
  constructor(
    private apiService:ApiService,
    public stateService:StateService,
    private route: ActivatedRoute,
    private router:Router,
    private coreHelperService:CoreHelperService) { }

  licenseId:string;

  breadcumDetail: any = {};
  licenseName:string = "";
  ngOnInit() {
    console.log("Loading LicenseDetailComponent");
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
    this.coreHelperService.settingProjectBreadcum("","","",false);
  }

  //onTabChange($event: NgbTabChangeEvent) {
  //  this.stateService.component_tabs_selectedTab=$event.nextId;
  //}

  /*public releaseCols = ['Name','Version'];
  public releases = [
    {version:'v1.4.3-RELEASE',date:'05/20/2020'},
    {version:'v1.4.2-RELEASE',date:'05/01/2020'},
    {version:'v1.4.1-RELEASE',date:'04/13/2020'},
    {version:'v1.4.0-RELEASE',date:'04/01/2020'},
    {version:'v1.4.0-RC5',date:'03/02/2020'},
    {version:'v1.4.0-RC4',date:'02/10/2020'},
    {version:'v1.4.0-RC3',date:'01/21/2020'},
    {version:'v1.4.0-RC2',date:'01/01/2020'},
    {version:'v1.4.3-RC1',date:'12/25/2019'},
    {version:'v1.3.9-RELEASE',date:'11/15/2019'},
  ];*/

  gotoProject() {
    const url = "dashboard/entity/" + this.entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  gotoComponent() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId + "/component/" + this.breadcumDetail.SelectedComponent['id'];
    this.coreHelperService.settingProjectBreadcum("License", "", "", false);
    this.router.navigate([url]);
  }

  //Getting license name after emiting
  getLicenseName(name){
    this.licenseName = name;
    this.coreHelperService.settingProjectBreadcum("License", this.licenseName, this.licenseId, false);
  }

  //Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.coreHelperService.getProjectBreadcum();
  }


}
