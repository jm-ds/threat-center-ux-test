import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material';
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
  obsScan: Observable<Scan>;

  columns = ['Name', 'SPDX', 'Threat Category', 'Style', 'OSI Approved', 'FSF Libre'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  licensesDetails: any;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    console.log("Loading LicensesComponent for scanId: ", this.scanId);
    this.obsScan = this.apiService.getScanLicenses(this.scanId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.scan));

    this.obsScan.subscribe(licenses => {
      this.licensesDetails = licenses;
    });
  }

  //While any changes occurred in page
  changePage(pageInfo) {
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      //page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //API Call
      this.loadLicensesData(Number(this.defaultPageSize), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      //Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        //call with after...
        if (!!this.licensesDetails.licenses.pageInfo && this.licensesDetails.licenses.pageInfo['hasNextPage']) {
          this.loadLicensesData(Number(this.defaultPageSize), undefined,
            this.licensesDetails.licenses.pageInfo['endCursor'], undefined);
        }
      } else {
        //call with before..
        if (!!this.licensesDetails.licenses.pageInfo && this.licensesDetails.licenses.pageInfo['hasPreviousPage']) {
          this.loadLicensesData(undefined, Number(this.defaultPageSize),
            undefined, this.licensesDetails.licenses.pageInfo['startCursor']);
        }
      }
    }
  }

  //Loading Licenses data after paggination for scan tab.
  loadLicensesData(first, last, endCursor = undefined, startCursor = undefined) {
    let licenses = this.apiService.getScanLicenses(this.scanId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scan));
  
   licenses.subscribe(license => {
      this.licensesDetails = license;
    });

  }

  gotoDetails(lId) {
    const entityId = this.route.snapshot.paramMap.get('entityId'), projectId = this.route.snapshot.paramMap.get('projectId');
    const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/license/" + lId;
    this.router.navigate([decodeURIComponent(url)]);
  }

}
