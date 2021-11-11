import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, filter, startWith } from 'rxjs/operators';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { FileViewComponent } from '@app/threat-center/shared/file-view/file-view.component';
import { AuthenticationService, AuthorizationService } from '@app/security/services';
import { CoreHelperService } from '@app/services/core/services/core-helper.service';
import Swal from "sweetalert2";
import { ScanAsset, ScanAssetMatch } from '@app/models';
import { ProjectBreadcumsService } from '@app/services/core/services/project-breadcums.service';
import { AlertService } from '@app/services/core/services/alert.service';
import { User } from '@app/threat-center/shared/models/types';
import { ClipboardDialogComponent } from '../../clipboard-dialog/clipboard-dialog.component';
import { ProjectService } from '@app/services/project.service';
import { RepositoryService } from '@app/services/repository.service';
import { StateService } from '@app/services/state.service';


@Component({
  selector: 'scanasset-detail',
  templateUrl: './scanasset-detail.component.html',
  styles: [
    `.text-primary:hover{
      text-decoration: underline;
      cursor: pointer;
    }`
  ],
  styleUrls: ['./scanasset-detail.component.scss']
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
  scanAssetId: string = "";
  scanId: string = "";
  attributionStatus: string = "";
  attributionComment: string = "";
  selectedMatches: ScanAssetMatch[] = [];
  user: User;

  attributionStatuses: CodeNamePair[] = [
    { code: "REVIEWED", name: "Reviewed" },
    { code: "IGNORED", name: "Ignored" },
    { code: "COMPLETE", name: "Complete" }
  ];
  isDisableAttributeLicensebtn: boolean = false;
  constructor(
    private projectService:ProjectService,
    private stateService: StateService,
    private repositoryService: RepositoryService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private coreHelperService: CoreHelperService,
    private projectBreadcumsService:ProjectBreadcumsService,
    private alertService:AlertService,
    protected authorizationService: AuthorizationService,
    private modalService: NgbModal) { }

  ngOnInit() {
    // we could use the scanId to load scan, which has the repository,
    // then use the scanAssetId to load scanAsset.
    // it's no ideal but will work for the demo.
    this.scanAssetId = this.route.snapshot.paramMap.get('scanAssetId');
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    // get the scan asset for this page
    let obsScanAsset = this.projectService.getScanAsset(this.scanId, this.scanAssetId)
      .pipe(map(result => result.data.scanAsset));

    this.user = this.authService.getFromSessionStorageBasedEnv("currentUser");      
    // https://github.com/threatrix/threat-center-ux/issues/4
    // Don't attempt to pull data for files that were not ACCEPTED status

    // lookup scan repository(it's attached to scan, not scanasset)
    this.projectService.getScanRepository(this.scanId)
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
            if (!!this.user.repositoryAccounts && !!this.user.repositoryAccounts.githubAccount) {
              const accessToken = this.user.repositoryAccounts.githubAccount.accessToken;
              console.log("ACCESS TOKEN:", accessToken);
  
              if (accessToken) {
                console.log("Getting file");
                this.repositoryService.fetchAuthenticatedAsset(repositoryOwner, repositoryName, assetId, accessToken)
                  .subscribe(result => {
                    this.sourceAsset.content = atob(result.content);
                  });
              }
            } else {
              console.error("Current user hasn't registered Github account")
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

  // go to project dashboard
  gotoProject() {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = "dashboard/entity/" + entityId + "/project/" + this.projectId;
    this.router.navigate([url]);
  }

  // go to License details page
  gotoLicense(liId) {
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const scanId = this.route.snapshot.paramMap.get('scanId');
    const url = "dashboard/entity/" + entityId + '/project/' + this.projectId + '/scan/' + scanId + "/license/" + liId;
    this.router.navigate([url]);
  }

  // Initialize breadcum details
  private initBreadcum() {
    this.breadcumDetail = this.projectBreadcumsService.getProjectBreadcum();
  }

  // open Attribution process model
  openAttributionModel(content) {
    if (!!this.selectedMatches && this.selectedMatches.length >= 1) {
      content.show();
    } else {
      this.alertService.alertBox('To attribute asset you have to select at least one of third-party assets which will be used for attribution','','info');
    }
  }

  // send attribute asset request
  attributeAsset(assetMatch, modelContent) {
    this.isDisableAttributeLicensebtn = true;
    this.projectService.attributeAsset(this.scanId, this.scanAssetId,
      this.selectedMatches, this.attributionStatus, this.attributionComment)
      .subscribe(data => {
        this.isDisableAttributeLicensebtn = false;
        Swal.close();
        modelContent.hide();
        if (data.data.attributeAsset) {
          this.alertService.alertBox('Attribution is successful','License attribution','success');
        } else {
          this.alertService.alertBox('Attribution is not required','License attribution','info');
        }
      }, (error) => {
        this.isDisableAttributeLicensebtn = false;
        Swal.close();
        modelContent.hide();
        this.alertService.alertBox('Attribution error','License attribution','error');
      });
  }

  attributeProcessExecutionModel(modelContent) {
    this.alertService.alertConfirm('Do you want to close dialog?', 'You can close modal, attribution process will complete. But if you leave this page you won’t get completion notification message.',
      'question', true, true, '#4680ff', '#6c757d', 'Yes', 'No')
      .then((result) => {
        if (result.value) {
          modelContent.hide();
        }
      });
  }

  //  selected matches change handler
  onSelectedChange(selectedAssetMatchId, selectedPercentMatch, isChecked) {
    if (isChecked) {
      this.selectedMatches.push({
        assetMatchId: selectedAssetMatchId,
        percentMatch: selectedPercentMatch
      });
    } else {
      let index = -1
      for (let i = 0; i < this.selectedMatches.length; i++) {
        if (this.selectedMatches[i].assetMatchId === selectedAssetMatchId) {
          index = i;
        }
        if (index != -1) {
          this.selectedMatches.splice(index, 1);
        }
      }
    }
  }

  // Open repository source in (target="_blank")
  openInNewTab(repositoryCode, repositoryOwner, repositoryName) {
    if(repositoryCode == 'GITHUB') {
      window.open("//github.com/" + repositoryOwner + "/" + repositoryName, '_blank');
    }
  }

  copyToClipboard(value: string, message: string) {
    if (value != null && value.length > 0) {
      navigator.clipboard.writeText(value).then(r => {
        const modalRef = this.modalService.open(ClipboardDialogComponent, {
          keyboard: false,
          centered: true,
          windowClass: 'clip-board-copy'
        });
        modalRef.componentInstance.message = message;
      });
    }
  }
}

class CodeNamePair {
  code: String;
  name: String;
}

