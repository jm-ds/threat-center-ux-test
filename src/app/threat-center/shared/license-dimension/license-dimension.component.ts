import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FixComponentDialogComponent } from "@app/threat-center/dashboard/project/fix-component-dialog/fix-component-dialog.component";
import { License, ScanLicense } from '@app/models';
import { ScanAssetsComponent } from '@app/threat-center/dashboard/project/scanasset/scanassets/scanassets.component';
import {CoreHelperService} from "@app/core/services/core-helper.service";
import {UserPreferenceService} from "@app/core/services/user-preference.service";
import {Messages} from "@app/messages/messages";
import { LicenseDialogComponent } from '@app/threat-center/dashboard/project/licenses-common-dialog/license-dialog.component';



@Component({
  selector: 'license-dimension',
  templateUrl: './license-dimension.component.html',
  styleUrls: ['./license-dimension.component.scss']
})
export class LicenseDimensionComponent implements OnInit {

  public licenseCols = ['Name', 'Threat'];

  @Input() licenseId: string;
  @Input() licenseDiscovery: string;
  @Input() licenseOrigin: string;
  @Input() scanId: string;
  @Input() projectId: string;
  @Input() entityId: string;
  @Input() isFromComponent: boolean;
  @Output() getLicenseName: EventEmitter<any> = new EventEmitter();
  obsScanLicense: Observable<ScanLicense>;
  obsLicense: Observable<License>;
  obsLicenseComponents: Observable<any>;
  licenseComponents: any;
  newVersion: string;
  defaultPageSize = 25;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(ScanAssetsComponent, { static: false }) child: ScanAssetsComponent;



  componentColumns = [
    { field: 'name', header: 'Name' },
    { field: 'group', header: 'Group' },
    { field: 'version', header: 'Version' },
    { field: 'location', header: 'Location' },
    { field: 'discoveryMethod', header: 'Discovery' },
    { field: 'license.name', header: 'Licenses' },
    { field: 'vulnerabilities', header: 'Vulnerabilities' }
  ];

  assetColumns = ['Name', 'File Size', 'Status', 'Embedded Assets', 'Match Type'];
  scanAssetDetails: any;
  columnsAssetFilter = new Map();
  story = [];
  assetTimeOut;
  assetTimeOutDuration = 1000;
  parentScanAssetId = '';
  messages = Messages;
  obsScanLicenseAssets: Observable<ScanLicense>



  permissions: any[];
  limitations: any[];
  conditions: any[];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private fixService: FixService,
    private modalService: NgbModal,
    private coreHelperService: CoreHelperService,
    private userPreferenceService: UserPreferenceService
  ) {
  }

  ngOnInit() {
    if (this.licenseId) {
      if (this.isFromComponent || !!this.scanId) {
        this.loadLicenseAndLicenseComponent(this.defaultPageSize);
      } else {
        this.loadLicense();
        this.loadLicenseComponents(this.defaultPageSize);
        this.reloadAssets();
      }
    }
  }

  setLicense(event) {
    this.licenseId = event.data.licenseId;
    if (this.licenseId) {
      this.loadLicense();
      this.loadLicenseComponents(this.defaultPageSize);

    }
  }


  loadLicenseAndLicenseComponent(first, last = undefined, endCursor = undefined, startCursor = undefined) {
    this.obsScanLicense = this.projectService.getLicenseAndLicenseComponent(this.licenseId, this.licenseDiscovery, this.licenseOrigin, this.scanId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scanLicense));
    this.obsScanLicense.subscribe(scanLicense => {
      if (!!scanLicense.license) {
        this.getLicenseName.emit(scanLicense.license.name);
        this.permissions = this.licenseAttributeFilter(scanLicense.license, 'PERMISSION');
        this.limitations = this.licenseAttributeFilter(scanLicense.license, 'LIMITATION');
        this.conditions = this.licenseAttributeFilter(scanLicense.license, 'CONDITION');
        if (!!this.isFromComponent || !this.scanId) {
          return;
        }
        this.licenseComponents = scanLicense.scanComponents;
        this.scanAssetDetails = scanLicense.scanAssetsTree;
      }
    });
  }

  // load license data
  loadLicense() {
    this.obsLicense = this.projectService.getLicense(this.licenseId)
      .pipe(map(result => result.data.license));
    this.obsLicense.subscribe(license => {
      this.getLicenseName.emit(license.name);
      this.permissions = this.licenseAttributeFilter(license, 'PERMISSION');
      this.limitations = this.licenseAttributeFilter(license, 'LIMITATION');
      this.conditions = this.licenseAttributeFilter(license, 'CONDITION');
    });
  }

  // load license component data
  loadLicenseComponents(first, last = undefined, endCursor = undefined, startCursor = undefined) {
    if (!!this.isFromComponent || !this.scanId) {
      return;
    }
    this.obsLicenseComponents = this.projectService.getLicenseComponents(this.licenseId, this.licenseDiscovery, this.licenseOrigin, this.scanId, first, last, endCursor, startCursor)
      .pipe(map(result => result.data.scanLicense.scanComponents));
    this.obsLicenseComponents.subscribe(licenseComponents => {
      this.licenseComponents = licenseComponents;
    });
  }

  licenseAttributeFilter(license: any, type: string) {
    return license.attributes.filter(function (attribute) {
      return attribute.type == type;
    });
  }

  // goto component page
  gotoComponentDetails(cId) {
    const url = "dashboard/entity/" + this.entityId + '/project/' + this.projectId + '/scan/' + this.scanId + "/license/" + this.licenseId + "/component/" + cId;
    this.router.navigate([decodeURIComponent(url)]);
  }

  fixVersion(componentId: string, oldVersion: string) {
    const modalRef = this.modalService.open(FixComponentDialogComponent, {
      keyboard: false,
    });
    modalRef.componentInstance.scanId = this.scanId;
    modalRef.componentInstance.newVersion = this.newVersion;
    modalRef.componentInstance.oldVersion = oldVersion;
    modalRef.componentInstance.componentId = componentId;
  }

  // While any changes occurred in page
  changePage(pageInfo) {
    if (this.defaultPageSize.toString() !== pageInfo.pageSize.toString()) {
      // page size changed...
      this.defaultPageSize = pageInfo.pageSize;
      // API Call
      this.loadLicenseComponents(Number(this.defaultPageSize), undefined, undefined, undefined);
      this.paginator.firstPage();
    } else {
      // Next and Previous changed
      if (pageInfo.pageIndex > pageInfo.previousPageIndex) {
        // call with after...
        if (!!this.licenseComponents.pageInfo && this.licenseComponents.pageInfo['hasNextPage']) {
          this.loadLicenseComponents(Number(this.defaultPageSize), undefined,
            this.licenseComponents.pageInfo['endCursor'], undefined);
        }
      } else {
        // call with before..
        if (!!this.licenseComponents.pageInfo && this.licenseComponents.pageInfo['hasPreviousPage']) {
          this.loadLicenseComponents(undefined, Number(this.defaultPageSize),
            undefined, this.licenseComponents.pageInfo['startCursor']);
        }
      }
    }
  }

  // filter asset
  filterAssetColumn(column, value, idElement: string = '') {
    if (value.length === 0 || value === 'ALL') {
      this.columnsAssetFilter.delete(column);
    } else {
      this.columnsAssetFilter.set(column, value);
    }
    clearTimeout(this.assetTimeOut);
    this.assetTimeOut = setTimeout(() => {
      const obsScanLicense = this.projectService.getScanLicenseAssets(this.licenseId, this.licenseDiscovery, this.licenseOrigin, this.scanId,
        Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")),
        undefined, undefined, undefined,
        this.parentScanAssetId, this.makeAssetFilterMapForService())
        .pipe(map(result => result.data.scanLicense))
      obsScanLicense.subscribe(scanLicense => {
        this.scanAssetDetails = scanLicense.scanAssetsTree;;
        this.coreHelperService.setFocusOnElement(idElement);
      });
    }, this.assetTimeOutDuration);
  }

  // return asset filter value
  getAssetColumnFilterValue(key) {
    let value = this.columnsAssetFilter.get(key);
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

  // asset sort
  sortAssets(scanAssets: any) {
    if (!scanAssets) {
      return;
    }
    return scanAssets
      .sort((a, b) => a.node.status.localeCompare(b.node.status))
      .sort((a, b) => b.node.embeddedAssets.length - a.node.embeddedAssets.length)
      .sort((a, b) => a.node.assetType.localeCompare(b.node.assetType));
  }

  // build asset filter string
  private makeAssetFilterMapForService() {
    let filterString = '';
    this.columnsAssetFilter.forEach((val, key) => {
      filterString += key + ":" + val + ",";
    });
    return filterString;
  }

  getAssetName(name: string) {
    if (name.includes('/') || name.includes("\\")) {
      const orgname = name.replace('\\', '/');
      return orgname.substring(orgname.lastIndexOf('/') + 1);
    } else {
      return name;
    }
  }

  // return match type caption by match type code
  public assetMatchTypeVal2Caption(val: string) {
    switch (val) {
      case 'UNIQUE_PROPRIETARY': return 'PROPRIETARY ';
      case 'PROPRIETARY': return 'PROPRIETARY/OPEN SOURCE ';
      case 'EMBEDDED_OPEN_SOURCE': return 'OPEN SOURCE/PROPRIETARY ';
      case 'OPEN_SOURCE': return 'OPEN SOURCE ';
      case 'OPEN_COMPONENT': return 'OPEN SOURCE COMPONENT ';
      default: return 'STATIC REFERENCE ';
    }
  }

  // Move up the asset hierarchy
  assetGoBack() {
    this.parentScanAssetId = this.story.pop().id;
    this.refreshAssetListHelper();
  }

  // Move down the asset hierarchy
  assetGotoDetails(scanAsset) {
    if (scanAsset.node.assetType === 'DIR') {
      this.story.push({ id: this.parentScanAssetId, originalName: scanAsset.node.name, name: this.assetBreadcumSetting(scanAsset) });
      this.parentScanAssetId = scanAsset.node.scanAssetId;
      this.reloadAssets();
    } else {
      if (scanAsset.node.embeddedAssets.edges.length >= 1) {
        let sAssetId = scanAsset.node.scanAssetId;
        const url = "dashboard/entity/" + this.entityId + '/project/' + this.projectId + '/scan/' + this.scanId + "/scanasset/" + sAssetId;
        this.router.navigate([decodeURIComponent(url)]);
      }
    }
  }

  refreshAssetListHelper() {
    this.reloadAssets();
  }

  // reload asset tree
  reloadAssets() {
    this.scanAssetDetails = [];
    let obsScanLicenseAssets = this.projectService.getScanLicenseAssets(this.licenseId, this.licenseDiscovery, this.licenseOrigin, this.scanId,
      Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Assets")),
      undefined, undefined, undefined,
      this.parentScanAssetId, this.makeAssetFilterMapForService())
      .pipe(map(result => result.data.scanLicense));
    obsScanLicenseAssets.subscribe(scanLicense => {
      this.scanAssetDetails = scanLicense.scanAssetsTree;
    });
  }

  gotoLicense(selectedData){
    const modalRef = this.modalService.open(LicenseDialogComponent, { size: 'lg' });
    modalRef.componentInstance.selectedLicenseDetail = { name: selectedData.name, licensesList: selectedData.licenses['edges'] };
  }

  private assetBreadcumSetting(scanAsset) {
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

  getAssetSummationOfEmbeded(array: any[]) {
    return array.map(f => f.node['percentMatch']).reduce((a, b) => a + b, 0);
  }

}
