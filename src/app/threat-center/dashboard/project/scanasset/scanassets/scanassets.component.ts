import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { Scan } from '@app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Messages } from "@app/messages/messages";
import { UserPreferenceService } from '@app/services/core/user-preference.service';
import { SaveFilterStateService } from '@app/services/core/save-filter-state.service';
import { ProjectService } from '@app/services/project.service';

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

export class ScanAssetsComponent implements OnInit, OnDestroy {

  @Input() scanId;
  @Input() obsScan: Observable<Scan>;
  @Output() isAssetStory = new EventEmitter<boolean>();

  columns = ['Name', 'File Size', 'Status', 'Embedded Assets', 'Attribution', 'Match Type'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  scanAssetDetails: any;
  columnsFilter = new Map();
  timeOut;
  timeOutDuration = 1000;
  parentScanAssetId = '';
  story = [];
  messages = Messages;
  isDisablePaggination: boolean = false;
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService,
    private userPreferenceService: UserPreferenceService,
    private saveFilterStateService: SaveFilterStateService) { }

  ngOnDestroy(): void {
    this.saveFilterStateService.saveFilter(this.columnsFilter);
  }

  ngOnInit() {
    this.columnsFilter = this.saveFilterStateService.getFilter();
    this.story = [];
    this.isAssetStory.emit(false);
    console.log("scanId:", this.scanId);
    console.log("Loading ScanAssetsComponent");
    this.checkScanDataExists();
    this.defaultPageSize = this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets");
  }

  // Checking if scanObject is already passed from parent component if not then get data from server To make it re-use component
  checkScanDataExists() {
    const preferenceDetails = this.userPreferenceService.getPanelDetailByModule("Project");
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (!!preferenceDetails && !!preferenceDetails.assetPreferences
      && preferenceDetails.assetPreferences.length >= 1
      && !!preferenceDetails.assetPreferences.find(f => { return f.projectId === projectId })
      && !!preferenceDetails.assetPreferences.find(s => { return s.currrentScanId === this.scanId })) {
      const prefData = preferenceDetails.assetPreferences.find(f => { return f.projectId === projectId });
      this.scanAssetDetails = prefData.currentAssetDetails;
      this.story = prefData.currentStory;
      this.parentScanAssetId = !!prefData.parentScanAssetId ? prefData.parentScanAssetId : this.parentScanAssetId;
      this.obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
        .pipe(map(result => result.data.scan));
      this.initData();
    } else {
      this.obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
        .pipe(map(result => result.data.scan));
      this.initData();
    }
  }

  sort(scanAssets: any) {
    return scanAssets
      .sort((a, b) => a.node.status.localeCompare(b.node.status))
      .sort((a, b) => b.node.matchCount - a.node.matchCount)
      .sort((a, b) => a.node.assetType.localeCompare(b.node.assetType));
  }

  // While any changes occurred in page
  changePage(pageInfo) {
    this.isDisablePaggination = true;
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      // page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      //Setting item per page into session..
      this.userPreferenceService.settingUserPreference("Project", null, null, { componentName: "Assets", value: pageInfo.pageSize });
      // API Call
      this.loadScanAssetData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")), undefined, undefined, undefined);
      this.paginator.firstPage();
    }
    else {
      // Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        // call with after...
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasNextPage) {
          this.loadScanAssetData(Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")), undefined,
            this.scanAssetDetails.scanAssetsTree.pageInfo.endCursor, undefined);
        }
      } else {
        // call with before..
        if (!!this.scanAssetDetails.scanAssetsTree.pageInfo && this.scanAssetDetails.scanAssetsTree.pageInfo.hasPreviousPage) {
          this.loadScanAssetData(undefined, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")),
            undefined, this.scanAssetDetails.scanAssetsTree.pageInfo.startCursor);
        }
      }
    }
  }

  // Loading Scan Assets data after paggination.
  loadScanAssetData(first, last, endCursor = undefined, startCursor = undefined) {
    let scanAsset = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scan));
    scanAsset.subscribe(asset => {
      this.scanAssetDetails = asset;
      this.isDisablePaggination = false;
      this.setUserPreferencesDetailsForAseets();
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
      if (scanAsset.node.matchCount >= 1) {
        this.isAssetStory.emit(false);
        let sAssetId = scanAsset.node.scanAssetId;
        const entityId = this.route.snapshot.paramMap.get('entityId');
        const projectId = this.route.snapshot.paramMap.get('projectId');
        const url = "dashboard/entity/" + entityId + '/project/' + projectId + '/scan/' + this.scanId + "/scanasset/" + sAssetId;
        this.router.navigate([decodeURIComponent(url)]);
      }
    }
  }

  reload() {
    this.obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
      .pipe(map(result => result.data.scan));
    this.initData();
  }

  filterColumn(column, value, idElement: string = '') {
    if (value.length === 0 || value === 'ALL') {
      this.columnsFilter.delete(column);
    } else {
      this.columnsFilter.set(column, value);
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      const obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
        .pipe(map(result => result.data.scan));
      obsScan.subscribe(asset => {
        this.scanAssetDetails = asset;
        this.coreHelperService.setFocusOnElement(idElement);
        this.setUserPreferencesDetailsForAseets();
      });
    }, this.timeOutDuration);
  }

  getColumnFilterValue(key) {
    let value = this.columnsFilter.get(key);
    if (value === undefined) {
      if (key === 'Status' || key === 'File Size' || key === 'Embedded Assets' || key === 'Attribution' || key === 'Match Type') {
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

  getName(name: string) {
    if (name.includes('/') || name.includes("\\")) {
      const orgname = name.replace('\\', '/');
      return orgname.substring(orgname.lastIndexOf('/') + 1);
    } else {
      return name;
    }
  }

  getSummationOfEmbeded(array: any[]) {
    return array.map(f => f.node['percentMatch']).reduce((a, b) => a + b, 0);
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
      this.setUserPreferencesDetailsForAseets();
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

  // return match type caption by match type code
  public matchTypeVal2Caption(val: string) {
    switch (val) {
      case 'UNIQUE_PROPRIETARY': return 'PROPRIETARY ';
      case 'PROPRIETARY': return 'PROPRIETARY/OPEN SOURCE ';
      case 'EMBEDDED_OPEN_SOURCE': return 'OPEN SOURCE/PROPRIETARY ';
      case 'OPEN_SOURCE': return 'OPEN SOURCE ';
      case 'OPEN_COMPONENT': return 'OPEN SOURCE COMPONENT ';
      default: return 'STATIC REFERENCE ';
    }
  }

  private setUserPreferencesDetailsForAseets() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    this.userPreferenceService.settingUserPreference('Project', null, null, null, null, null, null, null, { currentStory: this.story, currentAssetDetails: this.scanAssetDetails, projectId: projectId, parentScanAssetId: this.parentScanAssetId, currrentScanId: this.scanId });
  }
}
