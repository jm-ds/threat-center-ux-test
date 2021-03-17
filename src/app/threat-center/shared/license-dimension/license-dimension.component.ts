import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@app/threat-center/shared/services/api.service';
import {FixResult, License} from '@app/threat-center/shared/models/types';
import {Router} from '@angular/router';
import {FixService} from '@app/threat-center/dashboard/project/services/fix.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatPaginator} from '@angular/material';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FixComponentDialogComponent} from "@app/threat-center/dashboard/project/fix-component-dialog/fix-component-dialog.component";


@Component({
  selector: 'license-dimension',
  templateUrl: './license-dimension.component.html',
  styleUrls: ['./license-dimension.component.scss']
})
export class LicenseDimensionComponent implements OnInit {

  public licenseCols = ['Name','Threat'];

  @Input() licenseId:string;
  @Input() licenses:License[];
  @Input() scanId: string;
  @Input() projectId: string;
  @Input() entityId: string;
  @Input() isFromComponent: boolean;
  @Output() getLicenseName: EventEmitter<any> = new EventEmitter();
  obsLicense:Observable<License>;
  obsLicenseComponents:Observable<any>;
  licenseComponents : any;
  fixResultObservable: Observable<FixResult[]>;
  newVersion: string;
  defaultPageSize = 25;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  
  componentColumns = [
    {field: 'name', header: 'Name'},
    {field: 'group', header: 'Group'},
    {field: 'version', header: 'Version'},
    {field: 'disc', header: 'Source'},
    {field: 'license.name', header: 'Licenses'},
    {field: 'vulnerabilities', header: 'Vulnerabilities'}
  ];


  permissions:any[];
  limitations:any[];
  conditions:any[];

  constructor(
      private apiService: ApiService,
      private router: Router,
      private fixService: FixService,
      private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    if(this.licenseId) {
      this.loadLicense();
      this.loadLicenseComponents(this.defaultPageSize);
    }
  }

  setLicense(event) {
    this.licenseId = event.data.licenseId;
    if(this.licenseId) {
      this.loadLicense();
      this.loadLicenseComponents(this.defaultPageSize);
    }
  }

  // load license data
  loadLicense() {
    this.obsLicense = this.apiService.getLicense(this.licenseId)
    .pipe(map(result => result.data.license));
    this.obsLicense.subscribe(license => {
      this.getLicenseName.emit(license.name);
      this.permissions = this.licenseAttributeFilter(license, 'PERMISSION');
      this.limitations = this.licenseAttributeFilter(license, 'LIMITATION');
      this.conditions = this.licenseAttributeFilter(license, 'CONDITION');
    });
  }

  // load license component data
  loadLicenseComponents(first, last = undefined, endCursor = undefined, startCursor = undefined) {
    if (!!this.isFromComponent || !this.scanId) {
      return;
    }
    this.obsLicenseComponents = this.apiService.getLicenseComponents(this.licenseId, this.scanId, first, last, endCursor, startCursor)
    .pipe(map(result => result.data.license.components));
    this.obsLicenseComponents.subscribe(licenseComponents => {
      this.licenseComponents = licenseComponents;
    });
  }

  licenseAttributeFilter(license:any, type:string) {
    return license.attributes.filter(function(attribute) {
      return attribute.type == type;
    });
  }

  // goto component page
  gotoComponentDetails(cId) {
    const url = "dashboard/entity/" + this.entityId + '/project/' + this.projectId + '/scan/' + this.scanId + "/license/" + this.licenseId + "/component/" + cId;
    this.router.navigate([decodeURIComponent(url)]);
  }

  fixVersion(componentId: string, oldVersion: string) {
    const  modalRef = this.modalService.open(FixComponentDialogComponent, {
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
        // API Call
        this.loadLicenseComponents(Number(this.defaultPageSize), undefined, undefined, undefined);
        this.paginator.firstPage();
    } else {
        // Next and Previous changed
        if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
            // call with after...
            if (!!this.licenseComponents.pageInfo && this.licenseComponents.pageInfo['hasNextPage']) {
                this.loadLicenseComponents(Number(this.defaultPageSize), undefined,
                    this.licenseComponents.pageInfo['endCursor'], undefined);
            }
        } else {
            // call with before..
            if (!!this.licenseComponents.pageInfo && this.licenseComponents.pageInfo['hasPreviousPage']) {
                this.loadLicenseComponents(undefined, Number(this.defaultPageSize),
                    undefined, this.licenseComponents.pageInfo['startCursor']);
            }
        }
    }
  }

}
