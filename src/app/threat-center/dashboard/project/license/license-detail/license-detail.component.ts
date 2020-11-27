import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import { Scan,License } from '@app/threat-center/shared/models/types';
import { ApiService,StateService } from '@app/threat-center/shared/services';


@Component({
  selector: 'license-detail',
  templateUrl: './license-detail.component.html',
  styles: []
})
export class LicenseDetailComponent implements OnInit {

  //obsComponent:Observable<Component>;
  //vulnerabilityColumns = ['Vulnerability','Cwe','Severity','CVSS2','CVSS3'];

  projectId:string = ""
  constructor(
    private apiService:ApiService,
    public stateService:StateService,
    private route: ActivatedRoute,
    private router:Router) { }

  licenseId:string;

  ngOnInit() {
    console.log("Loading LicenseDetailComponent");
    this.licenseId = this.route.snapshot.paramMap.get('licenseId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    /*let componentId = this.route.snapshot.paramMap.get('componentId');
    console.log("componentId:",componentId);
    this.obsComponent = this.apiService.getComponent(componentId)
    .pipe(map(result => result.data.component));*/
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
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

}
