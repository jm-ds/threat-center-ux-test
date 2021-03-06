import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, AuthorizationService } from '@app/security/services';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import Swal from "sweetalert2";
import {JiraCredentials, ScanAsset} from '@app/models';
import { ProjectBreadcumsService } from '@app/services/core/project-breadcums.service';
import { AlertService } from '@app/services/core/alert.service';
import { User } from '@app/threat-center/shared/models/types';
import { ClipboardDialogComponent } from '../../clipboard-dialog/clipboard-dialog.component';
import { ProjectService } from '@app/services/project.service';
import { RepositoryService } from '@app/services/repository.service';
import { StateService } from '@app/services/state.service';
import {OrgService} from "@app/services/org.service";
import {
    CreateJiraTicketComponent
} from "@app/threat-center/dashboard/project/create-jira-ticket/create-jira-ticket.component";


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
    jiraCredentials: JiraCredentials;
    orgId;

    constructor(
        private orgService: OrgService,
        private projectService: ProjectService,
        private stateService: StateService,
        private repositoryService: RepositoryService,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private coreHelperService: CoreHelperService,
        private projectBreadcumsService: ProjectBreadcumsService,
        private alertService: AlertService,
        public authorizationService: AuthorizationService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        this.loadData();
        // this.attributionStatus = "COMPLETE";
        this.initBreadcum();

        // Get the entity settings and check if there are any Jira settings
        this.orgService.getOrgSettings().subscribe(
            data => {
                if (data.data.orgSettings.jiraCredentials) {
                    this.jiraCredentials = data.data.orgSettings.jiraCredentials;
                }
            },
            error => {
                console.error("orgService.getOrgSettings().subscribe", error);
            }
        );
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
        this.repositoryService.fetchAsset(embeddedAsset.assetRepositoryUrl.data)
            .subscribe(response => {
                if (response.content) {
                    embeddedAsset.content = atob(response.content);
                }
                else {
                    //bitbucket return raw file only, it response hasn't node 'content'
                    embeddedAsset.content = atob(response);
                }
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


    // send attribute asset request ?????? ???????? ???? ??????????????????
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
                this.loadData(true);
                // this.getAndSetScanAssetIdWithStatus();
            }, (error) => {
                this.isDisableAttributeLicensebtn = false;
                Swal.close();
                attributeProcessExecuteMessageModel.hide();
                this.alertService.alertBox('Attribution error', 'License attribution', 'error');
            });
    }

    getAndSetScanAssetIdWithStatus() {
        if (!!sessionStorage.getItem('UPDATED_SCAN_ASSETID')) {
            let scanAssetIdLists = JSON.parse(sessionStorage.getItem('UPDATED_SCAN_ASSETID'));
            if (scanAssetIdLists.find(f => { f.scanAssetId === this.scanAssetId && f.scanId === this.scanId })) {
                scanAssetIdLists.forEach(element => {
                    if (element.scanAssetId === this.scanAssetId && element.scanId === this.scanId) {
                        element.status = this.attributionStatus;
                    }
                });
            } else {
                scanAssetIdLists.push({ scanAssetId: this.scanAssetId, status: this.attributionStatus, scanId: this.scanId });
            }
            sessionStorage.setItem('UPDATED_SCAN_ASSETID', JSON.stringify(scanAssetIdLists));
        } else {
            let scanAssetIdLists = [];
            scanAssetIdLists.push({ scanAssetId: this.scanAssetId, status: this.attributionStatus, scanId: this.scanId });
            sessionStorage.setItem('UPDATED_SCAN_ASSETID', JSON.stringify(scanAssetIdLists));
        }
    }

    attributeProcessExecutionModel(modelContent) {
        this.alertService.alertConfirm('Do you want to close dialog?', 'You can close modal, attribution process will complete. But if you leave this page you won???t get completion notification message.',
            'question', true, true, '#4680ff', '#6c757d', 'Yes', 'No')
            .then((result) => {
                if (result.value) {
                    modelContent.hide();
                }
            });
    }

    /**
     * Checked asset match change handler
     *
     * @param licenseId license ID
     * @param event input event
     */
    onCheckedAssetMatchChange(licenseId: string, event: Event) {
        const { checked } = event.target as HTMLInputElement;

        if (checked) {
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
            this.sourceAsset.embeddedAssets.edges.length > 0;
    }

    private loadData(isUpdate: boolean = false) {
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
                    obsScanAsset.subscribe(obsScanResult => {
                        this.orgId = obsScanResult.orgId; // It is necessary for jira ticket
                        this.attributionStatus = obsScanResult['attributionStatus'];
                        if (isUpdate) {
                            this.getAndSetScanAssetIdWithStatus();
                        }
                        if (!!obsScanResult && !!obsScanResult['sourceAssetAttribution'] && this.attributionStatus === 'COMPLETE') {
                            this.attributionComment = obsScanResult['sourceAssetAttribution'].attributedComment;
                        }
                        this.sourceAsset = obsScanResult;
                        if (!!this.user.repositoryAccounts) {
                            //the token is used to access the user(client) repository, which is possibly private
                            let accessToken;
                            if (result.scanRepository.repositoryEndpointType === 'GITHUB' && this.user.repositoryAccounts.githubAccount) {
                                accessToken = this.user.repositoryAccounts.githubAccount.accessToken;
                            }
                            if (result.scanRepository.repositoryEndpointType === 'GITLAB' && this.user.repositoryAccounts.gitlabAccount) {
                                accessToken = this.user.repositoryAccounts.gitlabAccount.accessToken;
                            }
                            if (result.scanRepository.repositoryEndpointType === 'BITBUCKET' && this.user.repositoryAccounts.bitbucketAccount) {
                                accessToken = this.user.repositoryAccounts.bitbucketAccount.accessToken;
                            }

                            console.log("ACCESS TOKEN:", accessToken);
                            if (accessToken) {
                                console.log("Getting file");
                                this.repositoryService.fetchAuthenticatedAsset(this.sourceAsset.assetRepositoryUrl.data, accessToken)
                                    .subscribe(response => {
                                        if (response.content) {
                                            this.sourceAsset.content = atob(response.content);
                                        }
                                        else {
                                            //bitbucket return raw file only, it response hasn't node 'content'
                                            this.sourceAsset.content = atob(response);
                                        }
                                    });
                            }
                            else {
                                console.error("Current user hasn't registered in any source repositories system");
                            }
                        } else {
                            console.error("Current user hasn't registered in any source repositories system");
                        }
                    });
                }
            });
    }

    createJiraTicket(assetMatchId) {
        const  modalRef = this.modalService.open(CreateJiraTicketComponent, {
            keyboard: false,
        });

        modalRef.componentInstance.projectId = this.projectId;
        modalRef.componentInstance.scanId = this.scanId;
        modalRef.componentInstance.orgId = this.orgId;
        modalRef.componentInstance.assetMatchId = assetMatchId;
    }

    // Generating the correct URL for a jira ticket
    openJiraTicket(key: string, self: string) {
        let url: string;
        if (this.jiraCredentials) {
            url = this.jiraCredentials.projectUrl + '/browse/' + key;
        } else {
            let selfUrl = new URL(self);
            url = selfUrl.hostname + '/browse/' + key;
        }
        window.open(url, "_blank");
    }
}
