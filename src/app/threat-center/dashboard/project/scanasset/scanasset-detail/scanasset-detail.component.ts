import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { Scan, License, ScanAsset, User, Repository } from '@app/threat-center/shared/models/types';
import { ApiService, StateService, RepositoryService } from '@app/threat-center/shared/services';
import { FileViewComponent } from '@app/threat-center/shared/file-view/file-view.component';
import { AuthenticationService } from '@app/security/services';
import { CoreHelperService } from '@app/core/services/core-helper.service';


@Component({
  selector: 'scanasset-detail',
  templateUrl: './scanasset-detail.component.html',
  styleUrls: [],
})
export class ScanAssetDetailComponent implements OnInit {

  obsScanAsset: Observable<ScanAsset>;
  obsScanAssetMatchGroup: Observable<ScanAsset>;

  // the asset content from the origin repositories
  //bsSourceAsset:Observable<ScanAsset>;
  //obsMatchAsset:Observable<ScanAsset>;

  sourceAsset: ScanAsset;
  matchAsset: ScanAsset;
  selectedRelease: any;
  selectedEmbeddedAsset: any;

  projectId: string = "";
  breadcumDetail: any = {};
  selectedMatchId: string = "";
  selectedPercent: number;
  scanAssetId: string = "";
  scanId: string = "";
  attributionStatus: string = "";
  attributionComment: string = "";

  attributionStatuses: CodeNamePair[] = [
                                              { code: "REVIEWED", name: "Reviewed" },
                                              { code: "IGNORED", name: "Ignored" },
                                              { code: "COMPLETE", name: "Complete" }
                                         ];

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private repositoryService: RepositoryService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router:Router,
    private coreHelperService:CoreHelperService) { }

  ngOnInit() {
    // we could use the scanId to load scan, which has the repository,
    // then use the scanAssetId to load scanAsset.
    // it's no ideal but will work for the demo.
    this.scanAssetId = this.route.snapshot.paramMap.get('scanAssetId');
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    // get the scan asset for this page
    let obsScanAsset = this.apiService.getScanAsset(this.scanId, this.scanAssetId)
      .pipe(map(result => result.data.scanAsset));

    // https://github.com/threatrix/threat-center-ux/issues/4
    // Don't attempt to pull data for files that were not ACCEPTED status

    // lookup scan repository(it's attached to scan, not scanasset)
    this.apiService.getScanRepository(this.scanId)
      .pipe(map(result => result.data.scan))
      .subscribe(result => {
        let scanRepository = result.scanRepository;

        // if we have a repo, pre-load the source asset
        if (scanRepository) {
          const repositoryOwner = scanRepository.repositoryOwner;
          const repositoryName = scanRepository.repositoryName;
          obsScanAsset.subscribe(result => {

            this.sourceAsset = result;
            let assetId = this.sourceAsset.originAssetId;

            // let user = this.authService.getFromStorageBasedEnv("currentUser");
            let user = this.authService.getFromSessionStorageBasedEnv("currentUser");
            const accessToken = user.repositoryAccounts.githubAccount.accessToken;
            console.log("ACCESS TOKEN:",accessToken);

            if (accessToken) {
              console.log("Getting file");
              this.repositoryService.fetchAuthenticatedAsset(repositoryOwner, repositoryName, assetId, accessToken)
                .subscribe(result => {
                  this.sourceAsset.content = atob(result.content);
                });
            }
            if (this.sourceAsset.embeddedAssets && this.sourceAsset.embeddedAssets.edges.length>0) {
              this.selectedMatchId = this.sourceAsset.embeddedAssets.edges[0].node.assetMatchId;
              this.selectedPercent = this.sourceAsset.embeddedAssets.edges[0].node.percentMatch;
            }
          });
        }
      });
      this.attributionStatus = "COMPLETE";
      this.initBreadcum();
  }

  releaseSelected() {
    console.log("SELECTED RELEASE:" + this.selectedRelease.releaseName);
  }

  setSelectedEmbeddedAsset(embeddedAsset: any) {
    this.selectedEmbeddedAsset = embeddedAsset;
  }

  fetchRepositoryAsset(embeddedAsset: ScanAsset) {
    let repositoryOwner = embeddedAsset.matchRepository.repositoryOwner;
    let repositoryName = embeddedAsset.matchRepository.repositoryName;
    let assetId = embeddedAsset.originAssetId;
    this.repositoryService.fetchAsset(repositoryOwner, repositoryName, assetId)
      .subscribe(result => {
        embeddedAsset.content = atob(result.content);
        this.matchAsset = embeddedAsset;
      });;
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.component_tabs_selectedTab = $event.nextId;
  }

  public releaseCols = ['Name', 'Version'];
  public releases = [
    { version: 'v1.4.3-RELEASE', date: '05/20/2020' },
    { version: 'v1.4.2-RELEASE', date: '05/01/2020' },
    { version: 'v1.4.1-RELEASE', date: '04/13/2020' },
    { version: 'v1.4.0-RELEASE', date: '04/01/2020' },
    { version: 'v1.4.0-RC5', date: '03/02/2020' },
    { version: 'v1.4.0-RC4', date: '02/10/2020' },
    { version: 'v1.4.0-RC3', date: '01/21/2020' },
    { version: 'v1.4.0-RC2', date: '01/01/2020' },
    { version: 'v1.4.3-RC1', date: '12/25/2019' },
    { version: 'v1.3.9-RELEASE', date: '11/15/2019' },
  ];

  //go to project dashboard
  gotoProject() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  //go to License details page
  gotoLicense(liId){
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const scanId = this.route.snapshot.paramMap.get('scanId');
    const url = "dashboard/entity/" + entityId + '/project/' + this.projectId + '/scan/' + scanId + "/license/" + liId;
    this.router.navigate([url]);
  }

  //Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.coreHelperService.getProjectBreadcum();
  }

  isSelected(matchId, percent) {
    return matchId == this.selectedMatchId;
  }

  attributeAsset(assetMatch) {
    this.apiService.attributeAsset(this.scanId, this.scanAssetId, 
      this.selectedMatchId, this.selectedPercent, this.attributionStatus, this.attributionComment)
      .subscribe(data => {
        console.info('AttributeAsset successful');
      }, (error) => {
        console.error('AttributeAsset error', error);
    });

  }

}

class CodeNamePair {
  code: String;
  name: String;
}

