import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Scan} from '@app/threat-center/shared/models/types';
import {ApiService} from '@app/threat-center/shared/services/api.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-scanassets',
  templateUrl: './scanassets.component.html',
  styles: []
})
export class ScanAssetsComponent implements OnInit {

  @Input() scanId;
  @Input() obsScan: Observable<Scan>;

  columns = ['Name', 'File Size', 'Workspace Path', 'Status', 'Embedded Assets'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  scanAssetDetails: any;
  columnsFilter = new Map();
  timeOut;
  timeOutDuration = 1000;
  parentScanAssetId = '';
  story = [];

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    console.log("scanId:", this.scanId);
    console.log("Loading ScanAssetsComponent");
    this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.defaultPageSize))
        .pipe(map(result => result.data.scan));
    this.initData();
  }

  sort(scanAssets: any) {
    return scanAssets
        .sort((a, b) => a.node.status.localeCompare(b.node.status))
        .sort((a, b) => b.node.embeddedAssets.length - a.node.embeddedAssets.length)
        .sort((a, b) => a.node.assetType.localeCompare(b.node.assetType));
  }

  // While any changes occurred in page
  changePage(pageInfo) {
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      // page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      // API Call
      this.loadScanAssetData(Number(this.defaultPageSize), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      // Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        // call with after...
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasNextPage) {
          this.loadScanAssetData(Number(this.defaultPageSize), undefined,
            this.scanAssetDetails.scanAssetsTree.pageInfo.endCursor, undefined);
        }
      } else {
        // call with before..
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasPreviousPage) {
          this.loadScanAssetData(undefined, Number(this.defaultPageSize),
            undefined, this.scanAssetDetails.scanAssetsTree.pageInfo.startCursor);
        }
      }
    }
  }

  // Loading Scan Assets data after paggination.
  loadScanAssetData(first, last, endCursor = undefined, startCursor = undefined) {
    let scanAsset = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scan));
    scanAsset.subscribe(asset => {
      this.scanAssetDetails = asset;
    });
  }

  goBack() {
    this.parentScanAssetId = this.story.pop();
    this.reload();
  }

  gotoDetails(scanAsset) {
    if (scanAsset.node.assetType === 'DIR') {
      this.story.push(this.parentScanAssetId);
      this.parentScanAssetId = scanAsset.node.scanAssetId;
      this.reload();
    } else {
      let sAssetId = scanAsset.node.scanAssetId;
      const entityId = this.route.snapshot.paramMap.get('entityId');
      const projectId = this.route.snapshot.paramMap.get('projectId');
      const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/scanasset/" + sAssetId;
      this.router.navigate([decodeURIComponent(url)]);
    }
  }
  
  reload() {
    this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.defaultPageSize))
        .pipe(map(result => result.data.scan));
    this.initData();
  }

  filterColumn(column, value) {
    if (value.length === 0 || value === 'ALL') {
      this.columnsFilter.delete(column);
    } else {
      this.columnsFilter.set(column, value);
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.defaultPageSize))
          .pipe(map(result => result.data.scan));
      this.initData();
    }, this.timeOutDuration);
  }

  getColumnFilterValue(key) {
    let value = this.columnsFilter.get(key);
    if (value === undefined) {
      if (key === 'Status' || key === 'File Size' || key === 'Embedded Assets') {
        return 'ALL';
      } else {
        return '';
      }
    } else {
      return value;
    }
  }

  private makeFilterMapForService() {
    let filterString = '';
    this.columnsFilter.forEach((val, key) => {
      filterString += key + ":" + val + ",";
    });
    return filterString;
  }

  // initializing data
  private initData() {
    this.obsScan.subscribe(asset => {
      this.scanAssetDetails = asset;
    });
  }
}
