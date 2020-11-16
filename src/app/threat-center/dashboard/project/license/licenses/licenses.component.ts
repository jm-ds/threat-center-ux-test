import { Component, Input, OnInit } from '@angular/core';
import { Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

@Component({
  selector: 'licenses',
  templateUrl: './licenses.component.html',
  styles: []
})
export class LicensesComponent implements OnInit {

  @Input() scanId;
  obsScan:Observable<Scan>;

  columns = ['Name','SPDX','Threat Category','Style','OSI Approved','FSF Libre'];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    console.log("Loading LicensesComponent for scanId: ",this.scanId);
    this.obsScan = this.apiService.getScanLicenses(this.scanId)
    .pipe(map(result => result.data.scan));
  }
}
