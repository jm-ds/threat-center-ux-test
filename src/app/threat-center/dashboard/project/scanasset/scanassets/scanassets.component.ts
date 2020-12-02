import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { Scan } from '@app/threat-center/shared/models/types';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'scanassets',
  templateUrl: './scanassets.component.html',
  styles: []
})
export class ScanAssetsComponent implements OnInit {

  @Input() scanId;
  obsScan: Observable<Scan>;

  columns = ['Name', 'File Size', 'Workspace Path', 'Status', 'Embedded Assets'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  scanAssetDetails: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    console.log("scanId:", this.scanId);
    console.log("Loading ScanAssetsComponent");
    this.obsScan = this.apiService.getScanAssets(this.scanId, Number(this.defaultPageSize))
      .pipe(map(result => result.data.scan));

    this.obsScan.subscribe(asset => {
      this.scanAssetDetails = asset;
    });
  }

  sort(scanAssets: any) {
    return scanAssets.sort((a, b) => a.node.status.localeCompare(b.node.status)).sort((a, b) => b.node.embeddedAssets.length - a.node.embeddedAssets.length);
  }

  //While any changes occurred in page
  changePage(pageInfo) {
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      //page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //API Call
      this.loadScanAssetData(Number(this.defaultPageSize), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      //Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        //call with after...
        if (!!this.scanAssetDetails.scanAssets.pageInfo && this.scanAssetDetails.scanAssets.pageInfo['hasNextPage']) {
          this.loadScanAssetData(Number(this.defaultPageSize), undefined,
            this.scanAssetDetails.scanAssets.pageInfo['endCursor'], undefined);
        }
      } else {
        //call with before..
        if (!!this.scanAssetDetails.scanAssets.pageInfo && this.scanAssetDetails.scanAssets.pageInfo['hasPreviousPage']) {
          this.loadScanAssetData(undefined, Number(this.defaultPageSize),
            undefined, this.scanAssetDetails.scanAssets.pageInfo['startCursor']);
        }
      }
    }
  }

  //Loading Scan Assets data after paggination.
  loadScanAssetData(first, last, endCursor = undefined, startCursor = undefined) {
    let scanAsset = this.apiService.getScanAssets(this.scanId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scan));
    scanAsset.subscribe(asset => {
      this.scanAssetDetails = asset;
    });
  }
}
