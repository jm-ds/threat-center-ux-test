import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime,map,filter,startWith } from 'rxjs/operators';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import { Scan,License,ScanAsset,User,Repository } from '@app/threat-center/shared/models/types';
import { ApiService,StateService,RepositoryService } from '@app/threat-center/shared/services';
import { FileViewComponent } from '@app/threat-center/shared/file-view/file-view.component';


@Component({
  selector: 'scanasset-detail',
  templateUrl: './scanasset-detail.component.html',
  styleUrls: [],
})
export class ScanAssetDetailComponent implements OnInit {

  obsScanAsset:Observable<ScanAsset>;

  // the asset content from the origin repositories
  //bsSourceAsset:Observable<ScanAsset>;
  //obsMatchAsset:Observable<ScanAsset>;

  sourceAsset:ScanAsset;
  matchAsset:ScanAsset;
  selectedRelease:any;
  selectedEmbeddedAsset:any;

  constructor(
    private apiService:ApiService,
    private stateService:StateService,
    private repositoryService:RepositoryService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // we could use the scanId to load scan, which has the repository,
    // then use the scanAssetId to load scanAsset.
    // it's no ideal but will work for the demo.
    let scanAssetId = this.route.snapshot.paramMap.get('scanAssetId');
    let scanId = this.route.snapshot.paramMap.get('scanId');

    // get the scan asset for this page
    let obsScanAsset = this.apiService.getScanAsset(scanId,scanAssetId)
      .pipe(map(result => result.data.scanAsset));

    // https://github.com/threatrix/threat-center-ux/issues/4
    // Don't attempt to pull data for files that were not ACCEPTED status

    // lookup scan repository(it's attached to scan, not scanasset)
    this.apiService.getScanRepository(scanId)
    .pipe(map(result => result.data.scan))
    .subscribe(result => {
      let scanRepository = result.scanRepository;

      // if we have a repo, pre-load the source asset
      if(scanRepository) {
        const repositoryOwner = scanRepository.repositoryOwner;
        const repositoryName = scanRepository.repositoryName;
        obsScanAsset.subscribe(result => {

          this.sourceAsset = result;
          let assetId = this.sourceAsset.originAssetId;

          let user:User = JSON.parse(localStorage.getItem("currentUser"));
          const accessToken = user.repositoryAccounts.githubAccount.accessToken;

          if(accessToken) {
            this.repositoryService.fetchAuthenticatedAsset(repositoryOwner,repositoryName,assetId,accessToken)
            .subscribe(result => {
              this.sourceAsset.content=atob(result.content);
            });
          }
        });
      }
    });
  }

  releaseSelected() {
    console.log("SELECTED RELEASE:"+this.selectedRelease.releaseName);
  }

  setSelectedEmbeddedAsset(embeddedAsset:any) {
    this.selectedEmbeddedAsset = embeddedAsset;
  }

  fetchRepositoryAsset(embeddedAsset:ScanAsset) {
    let repositoryOwner = embeddedAsset.matchRepository.repositoryOwner;
    let repositoryName = embeddedAsset.matchRepository.repositoryName;
    let assetId = embeddedAsset.originAssetId;
    this.repositoryService.fetchAsset(repositoryOwner,repositoryName,assetId)
    .subscribe(result => {
      embeddedAsset.content=atob(result.content);
      this.matchAsset = embeddedAsset;
    });;
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.stateService.component_tabs_selectedTab=$event.nextId;
  }

  public releaseCols = ['Name','Version'];
  public releases = [
    {version:'v1.4.3-RELEASE',date:'05/20/2020'},
    {version:'v1.4.2-RELEASE',date:'05/01/2020'},
    {version:'v1.4.1-RELEASE',date:'04/13/2020'},
    {version:'v1.4.0-RELEASE',date:'04/01/2020'},
    {version:'v1.4.0-RC5',date:'03/02/2020'},
    {version:'v1.4.0-RC4',date:'02/10/2020'},
    {version:'v1.4.0-RC3',date:'01/21/2020'},
    {version:'v1.4.0-RC2',date:'01/01/2020'},
    {version:'v1.4.3-RC1',date:'12/25/2019'},
    {version:'v1.3.9-RELEASE',date:'11/15/2019'},
  ];

}
