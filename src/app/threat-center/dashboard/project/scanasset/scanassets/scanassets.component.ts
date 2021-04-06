import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { Scan } from '@app/models';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Messages } from "@app/messages/messages";

@Component({
  selector: 'app-scanassets',
  templateUrl: './scanassets.component.html',
  styles: [
    `.text-primary:hover{
      text-decoration: underline;
      cursor: pointer;
    }`
  ]
})
export class ScanAssetsComponent implements OnInit {

  @Input() scanId;
  @Input() obsScan: Observable<Scan>;
  @Output() isAssetStory = new EventEmitter<boolean>();

  columns = ['Name', 'File Size', 'Workspace Path', 'Status', 'Embedded Assets', 'Attribution'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  scanAssetDetails: any;
  columnsFilter = new Map();
  timeOut;
  timeOutDuration = 1000;
  parentScanAssetId = '';
  story = [];
  messages = Messages;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService) { }

  ngOnInit() {
    this.story = [];
    this.isAssetStory.emit(false);
    console.log("scanId:", this.scanId);
    console.log("Loading ScanAssetsComponent");
    this.checkScanDataExists();
    this.defaultPageSize = this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets");
  }

  //Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
  checkScanDataExists() {
    if (!this.obsScan) {
      this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
        .pipe(map(result => result.data.scan));
      this.initData();
    } else {
      this.initData();
    }
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
      //Setting item per page into session..
      this.coreHelperService.settingUserPreference("Project", null, null, { componentName: "Assets", value: pageInfo.pageSize });
      // API Call
      this.loadScanAssetData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      // Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        // call with after...
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasNextPage) {
          this.loadScanAssetData(Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")), undefined,
            this.scanAssetDetails.scanAssetsTree.pageInfo.endCursor, undefined);
        }
      } else {
        // call with before..
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasPreviousPage) {
          this.loadScanAssetData(undefined, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")),
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
    this.parentScanAssetId = this.story.pop().id;
    this.refreshAssetListHelper();
  }

  gotoDetails(scanAsset) {
    if (scanAsset.node.assetType === 'DIR') {
      this.story.push({ id: this.parentScanAssetId, originalName: scanAsset.node.name, name: this.breadcumSetting(scanAsset) });
      this.isAssetStory.emit(true);
      this.parentScanAssetId = scanAsset.node.scanAssetId;
      this.reload();
    } else {
      this.isAssetStory.emit(false);
      let sAssetId = scanAsset.node.scanAssetId;
      const entityId = this.route.snapshot.paramMap.get('entityId');
      const projectId = this.route.snapshot.paramMap.get('projectId');
      const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/scanasset/" + sAssetId;
      this.router.navigate([decodeURIComponent(url)]);
    }
  }

  reload() {
    this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
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
      this.obsScan = this.apiService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
        .pipe(map(result => result.data.scan));
      this.initData();
    }, this.timeOutDuration);
  }

  getColumnFilterValue(key) {
    let value = this.columnsFilter.get(key);
    if (value === undefined) {
      if (key === 'Status' || key === 'File Size' || key === 'Embedded Assets' || key === 'Attribution') {
        return 'ALL';
      } else {
        return '';
      }
    } else {
      return value;
    }
  }

  goBackfromBreadcum(id, currentIndex) {
    if (currentIndex != (this.story.length - 1)) {
      const startIndexToRemove = currentIndex + 1;
      this.parentScanAssetId = this.story[startIndexToRemove].id;
      this.story.splice(startIndexToRemove, this.story.length - (startIndexToRemove));
      this.refreshAssetListHelper();
    }
  }

  refreshAssetListHelper() {
    if (!this.story || this.story.length == 0) {
      this.isAssetStory.emit(false);
    }
    this.reload();
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

  private breadcumSetting(scanAsset) {
    if (!!this.story && this.story.length >= 1) {
      const lastRecord = this.story[this.story.length - 1].originalName;
      if (!!lastRecord) {
        const diffrence = this.coreHelperService.getDifferencebetweenStrings(lastRecord, scanAsset.node.name);
        return diffrence.replace('/', "");
      } else {
        return scanAsset.node.name;
      }
    } else {
      return scanAsset.node.name;
    }
  }

}
