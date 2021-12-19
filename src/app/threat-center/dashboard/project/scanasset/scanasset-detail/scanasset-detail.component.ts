import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, AuthorizationService } from '@app/security/services';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import Swal from "sweetalert2";
import { ScanAsset, ScanAssetMatch } from '@app/models';
import { ProjectBreadcumsService } from '@app/services/core/project-breadcums.service';
import { AlertService } from '@app/services/core/alert.service';
import { User } from '@app/threat-center/shared/models/types';
import { ClipboardDialogComponent } from '../../clipboard-dialog/clipboard-dialog.component';
import { ProjectService } from '@app/services/project.service';
import { RepositoryService } from '@app/services/repository.service';
import { StateService } from '@app/services/state.service';


@Component({
    selector: 'app-scanasset-detail',
    templateUrl: './scanasset-detail.component.html',
    styles: [
        `.text-primary:hover {
            text-decoration: underline;
            cursor: pointer;
        }`
    ],
    styleUrls: ['./scanasset-detail.component.scss']
})
export class ScanAssetDetailComponent implements OnInit {

    sourceAsset: ScanAsset;
    matchAsset: ScanAsset;
    selectedEmbeddedAsset: any;

    projectId = "";
    breadcumDetail: any = {};
    scanAssetId = "";
    scanId = "";
    attributionStatus = "";
    attributionComment = "";
    selectedLicenses = [];
    user: User;

    isDisableAttributeLicensebtn = false;

    constructor(
        private projectService: ProjectService,
        private stateService: StateService,
        private repositoryService: RepositoryService,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private coreHelperService: CoreHelperService,
        private projectBreadcumsService: ProjectBreadcumsService,
        private alertService: AlertService,
        protected authorizationService: AuthorizationService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        this.loadData();
        // this.attributionStatus = "COMPLETE";
        this.initBreadcum();
    }

    getTextForButton() {
        return !this.attributionStatus ? 'Attribute Licenses' : 'License Attribution ' + this.getStatus();
    }

    getStatus() {
        let status = this.attributionStatus;
        switch (this.attributionStatus) {
            case 'REQUIRED':
                status = 'Required';
                break;
            case 'PARTIAL':
                status = 'Partial';
                break;
            case 'COMPLETE':
                status = 'Complete';
                break;
            case 'REVIEWED_IGNORED':
                status = 'Reviewed Ignored';
                break;
            default:
                break;
        }
        return status;
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
            });
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


    // send attribute asset request тут шлем на атрибуцию
    attributeAsset(assetMatch, attributionLicensesModal, attributeProcessExecuteMessageModel, ignore: boolean) {
        if (!ignore) {
            if (!this.selectedLicenses || this.selectedLicenses.length === 0) {
                this.alertService.alertBox('To attribute asset you have to select at least one of license which will be used for attribution', '', 'info');
                return;
            }
        }
        attributionLicensesModal.hide();
        attributeProcessExecuteMessageModel.show();
        this.isDisableAttributeLicensebtn = true;
        this.projectService.attributeAsset(this.scanId, this.scanAssetId, ignore ? null : this.selectedLicenses, this.attributionComment)
            .subscribe(result => {
                this.isDisableAttributeLicensebtn = false;
                Swal.close();
                attributeProcessExecuteMessageModel.hide();
                if (result.data.attributeAsset) {
                    this.alertService.alertBox('Attribution is successful', 'License attribution', 'success');
                } else {
                    this.alertService.alertBox('Attribution is not required', 'License attribution', 'info');
                }
                this.loadData();
            }, (error) => {
                this.isDisableAttributeLicensebtn = false;
                Swal.close();
                attributeProcessExecuteMessageModel.hide();
                this.alertService.alertBox('Attribution error', 'License attribution', 'error');
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
    onSelectedChange(licenseId, isChecked) {
        if (isChecked) {
            this.selectedLicenses.push(licenseId);
        } else {
            let index = -1;
            for (let i = 0; i < this.selectedLicenses.length; i++) {
                if (this.selectedLicenses[i] === licenseId) {
                    index = i;
                }
                if (index !== -1) {
                    this.selectedLicenses.splice(index, 1);
                }
            }
        }
    }

    // Open repository source in (target="_blank")
    openInNewTab(repositoryCode, repositoryOwner, repositoryName) {
        if (repositoryCode == 'GITHUB') {
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

    getSourceAssetMatchLicenses() {
        let licenses = [];
        let licenseIds = [];
        this.sourceAsset.embeddedAssets.edges.forEach(embAsset => {
            embAsset.node.matchLicenses.forEach(l => {
                if (l.needIncludeInCode && !licenseIds.includes(l.licenseId)) {
                    licenses.push(l);
                    licenseIds.push(l.licenseId);
                }
            });
        });
        return licenses;
    }

    needAttribution() {
        return this.sourceAsset.embeddedAssets.edges != null &&
            this.sourceAsset.embeddedAssets.edges.length > 0 &&
            this.sourceAsset.attributionStatus === 'REQUIRED';
    }

    private loadData() {
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
                    obsScanAsset.subscribe(obsScanResult => {
                        this.attributionStatus = obsScanResult['attributionStatus'];
                        if (!!obsScanResult && !!obsScanResult['sourceAssetAttribution'] && this.attributionStatus === 'COMPLETE') {
                            this.attributionComment = obsScanResult['sourceAssetAttribution'].attributedComment;
                        }
                        this.sourceAsset = obsScanResult;
                        let assetId = this.sourceAsset.originAssetId;

                        // let user = this.authService.getFromStorageBasedEnv("currentUser");
                        if (!!this.user.repositoryAccounts && !!this.user.repositoryAccounts.githubAccount) {
                            const accessToken = this.user.repositoryAccounts.githubAccount.accessToken;
                            console.log("ACCESS TOKEN:", accessToken);

                            if (accessToken) {
                                console.log("Getting file");
                                this.repositoryService.fetchAuthenticatedAsset(repositoryOwner, repositoryName, assetId, accessToken)
                                    .subscribe(r => {
                                        this.sourceAsset.content = atob(r.content);
                                    });
                            }
                        } else {
                            console.error("Current user hasn't registered Github account");
                        }
                    });
                }
            });
    }
}
