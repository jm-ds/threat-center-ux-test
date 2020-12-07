import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'licenses',
  templateUrl: './licenses.component.html',
  styles: []
})
export class LicensesComponent implements OnInit {

  @Input() scanId;
  @Output() dataCount = new EventEmitter<string>();
  obsScan: Observable<Scan>;

  columns = ['Name', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    console.log("Loading LicensesComponent for scanId: ", this.scanId);
    this.obsScan = this.apiService.getScanLicenses(this.scanId)
      .pipe(map(result => result.data.scan));

    this.obsScan.subscribe((licenses: any) => {
      this.dataCount.emit(licenses.licenses.totalCount);
    });
  }

  gotoDetails(lId) {
    const entityId = this.route.snapshot.paramMap.get('entityId'), projectId = this.route.snapshot.paramMap.get('projectId');
    const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId;
    this.router.navigate([decodeURIComponent(url)]);
  }
}
