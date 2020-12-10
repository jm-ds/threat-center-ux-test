import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

import { ApiService } from '@app/threat-center/shared/services/api.service';
import { License } from '@app/threat-center/shared/models/types';
import { SelectItem } from 'primeng/api';
import { FilterUtils } from 'primeng/utils';


@Component({
  selector: 'license-dimension',
  templateUrl: './license-dimension.component.html',
  styleUrls: ['./license-dimension.component.scss']
})
export class LicenseDimensionComponent implements OnInit {

  public selectedLicense:License;
  public licenseCols = ['Name','Threat'];

  @Input() licenseId:string;
  @Input() licenses:License[];
  @Output() getLicenseName: EventEmitter<any> = new EventEmitter();
  obsLicense:Observable<License>;

  permissions:any[];
  limitations:any[];
  conditions:any[];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    console.log("LicenseId:",this.licenseId);
    if(this.licenseId) {
      this.loadLicense();
      this.obsLicense.subscribe(license => {
        this.getLicenseName.emit(license.name);
        this.permissions = this.licenseAttributeFilter(license, 'PERMISSION');
        this.limitations = this.licenseAttributeFilter(license, 'LIMITATION');
        this.conditions = this.licenseAttributeFilter(license, 'CONDITION');
      });
    }
  }

  setLicense(event) {
    this.licenseId = event.data.licenseId;
    console.log("LicenseId: ",this.licenseId);
    if(this.licenseId) {
      this.loadLicense();
    }
  }

  loadLicense() {
    this.obsLicense = this.apiService.getLicense(this.licenseId)
    .pipe(map(result => result.data.license));
  }

  licenseAttributeFilter(license:any, attributeType:string) {
    return license.attributes.filter(function(attribute) {
      return attribute.attributeType == attributeType;
    });
  }
}
