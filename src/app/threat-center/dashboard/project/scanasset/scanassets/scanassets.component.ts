import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Scan, ScanAsset, ScanOpenSourceProject } from '@app/models';
import { MESSAGES } from '@app/messages/messages';
import { IgnoredFiles, Level, Type } from '@app/models/ignored-files';

import { CoreHelperService } from '@app/services/core/core-helper.service';
import { UserPreferenceService } from '@app/services/core/user-preference.service';
import { SaveFilterStateService } from '@app/services/core/save-filter-state.service';
import { ProjectService } from '@app/services/project.service';
import { ScanService } from '@app/services/scan.service';
import { AlertService } from '@app/services/core/alert.service';

@Component({
  selector: 'app-scanassets',
  templateUrl: './scanassets.component.html',
  styleUrls: ['./scanassets.component.scss']
})

export class ScanAssetsComponent implements OnInit, OnDestroy {

  @Input() scanId;
  @Input() obsScan: Observable<Scan>;

  @Output() isAssetStory = new EventEmitter<boolean>();

  columns = ['Name', 'File Size', 'Status', 'Embedded Assets', 'Attribution', 'Match Type'];

  defaultPageSize = 25;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scanAssetDetails: any;
  scanOpenSourceProject: ScanOpenSourceProject;
  columnsFilter = new Map();
  timeOut;
  timeOutDuration = 1000;
  parentScanAssetId = '';
  story = [];
  MESSAGES = MESSAGES;
  isDisablePaggination: boolean = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService,
    private userPreferenceService: UserPreferenceService,
    private saveFilterStateService: SaveFilterStateService,
    private scanService: ScanService,
    private alertService: AlertService
  ) { }

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

  updateDataOnSelectedScan(obsScan, scanId) {
    this.scanId = scanId;
    this.obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
      .pipe(map(result => result.data.scan));
    this.initData();
  }

  sort(scanAssets: any) {
    return scanAssets
      .sort((a, b) => a.node.status.localeCompare(b.node.status))
      .sort((a, b) => b.node.matchCount - a.node.matchCount)
      .sort((a, b) => a.node.scanAssetType.localeCompare(b.node.scanAssetType));
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
      this.filterOnlyAssetsIfFilterActivated();
      this.isDisablePaggination = false;
      this.setUserPreferencesDetailsForAseets();
    });
  }

  goBack() {
    this.parentScanAssetId = this.story.pop().id;
    this.refreshAssetListHelper();
  }

  gotoDetails(scanAsset) {
    if (scanAsset.node.scanAssetType === 'DIR') {
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

  /**
   * Ignore/unignore specific asset path
   *
   * @param event mouse event
   * @param asset scan asset
   * @param ignore whether ignore or unignore asset
   */
  onIgnoreAsset(event: MouseEvent, {
    name,
    projectId: objectID,
    workspacePath
  }: ScanAsset, ignore: boolean) {
    event.stopPropagation();

    const pattern = workspacePath || name;

    const ignoredAsset = new IgnoredFiles();

    ignoredAsset.objectId = objectID;
    ignoredAsset.pattern = pattern;
    ignoredAsset.level = Level.PROJECT;
    ignoredAsset.type = Type.PATHS;

    const ignoredFiles$ = ignore
      ? this.scanService.saveIgnoredFiles(ignoredAsset)
      : this.scanService.removeIgnoredFiles(ignoredAsset);

    ignoredFiles$.subscribe({
      next: () => {
        this.alertService.alertBox(
          `${pattern} asset successfully ${ignore ? 'ignored' : 'unignored'}`,
          `${ignore ? 'Ignore' : 'Unignore'} Asset`,
          'success'
        );
      },
      error: () => {
        this.alertService.alertBox(
          `Error while ${ignore ? 'ignoring' : 'unignoring'} ${pattern} asset`,
          `${ignore ? 'Ignore' : 'Unignore'} Asset`,
          'error'
        );
      }
    });
  }

  reload() {
    this.obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")))
      .pipe(map(result => result.data.scan));
    this.initData();
  }

  filterOnlyAssetsIfFilterActivated() {
    if (!!this.scanAssetDetails && this.scanAssetDetails.scanAssetsTree.edges.length >= 1 && this.columnsFilter.size >= 1) {
      this.scanAssetDetails.scanAssetsTree.edges =
        this.scanAssetDetails.scanAssetsTree.edges.filter(asset => { return asset.node.scanAssetType !== 'DIR' });
    }
  }

  /**
   * Filter by column
   *
   * @param column column name
   * @param event input event
   * @param idElement element ID
   */
  onFilterColumn(column: string, event: Event, idElement: string = '') {
    const { value } = event.target as HTMLInputElement | HTMLSelectElement;

    if (value.length === 0 || value === 'ALL') {
      this.columnsFilter.delete(column);
    } else {
      this.columnsFilter.set(column, value);
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      const obsScan = this.projectService.getScanAssets(this.scanId, this.parentScanAssetId, this.makeFilterMapForService(), Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")), undefined, undefined, undefined, 'no-cache')
        .pipe(map(result => result.data.scan));
      obsScan.subscribe(asset => {
        this.scanAssetDetails = asset;
        this.filterOnlyAssetsIfFilterActivated();
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
    this.isDisablePaggination = true;
    this.obsScan.subscribe(asset => {
      this.isDisablePaggination = false;
      this.scanAssetDetails = asset;
      if (!!sessionStorage.getItem('UPDATED_SCAN_ASSETID')) {
        const scanAssetIdLists = JSON.parse(sessionStorage.getItem('UPDATED_SCAN_ASSETID'));
        this.scanAssetDetails.scanAssetsTree.edges.forEach(element => {
          if (!!scanAssetIdLists.find(f => f.scanAssetId === element.node.scanAssetId && this.scanId === f.scanId)) {
            element.node.attributionStatus = scanAssetIdLists.find(f => f.scanAssetId === element.node.scanAssetId).status;
          }
        });
      }
      this.filterOnlyAssetsIfFilterActivated();
      this.setUserPreferencesDetailsForAseets();
    }, err => {
      this.isDisablePaggination = false;
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
