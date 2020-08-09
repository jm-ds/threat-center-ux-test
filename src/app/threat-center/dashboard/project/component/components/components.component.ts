import { Component, Input, OnInit } from '@angular/core';
import { Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';

@Component({
  selector: 'components',
  templateUrl: './components.component.html',
  styles: []
})
export class ComponentsComponent implements OnInit {

  @Input() scanId;
  obsScan:Observable<Scan>;

  columns = [
    { field: 'name', header: 'Name'},
    { field: 'group', header: 'Group'},
    { field: 'version', header: 'Version'},
    { field: 'isInternal', header: 'Internal'},
    { field: 'disc', header: 'Source'},
    { field: 'license.name', header: 'Licenses'},
    { field: 'vulnerabilities', header: 'Vulnerabilities'},
  ];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    console.log("scanId:",this.scanId);
    console.log("Loading ComponentsComponent");
    this.obsScan = this.apiService.getScanComponents(this.scanId)
    .pipe(map(result => result.data.scan));
  }
}
