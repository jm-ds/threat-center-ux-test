import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterUtils } from 'primeng/utils';

import { interval, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { BitbucketUser, Branch, GitHubUser, GitLabUser, ScanRequest } from '@app/threat-center/shared/models/types';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '@app/threat-center/shared/task/task.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from '@app/security/services';
import { ScanHelperService } from '../../services/scan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from '../../project-scan-dialog/loading-dialog.component';

@Component({
    selector: 'app-quickstart',
    templateUrl: './quickstart-wizard.component.html',
    styleUrls: ['./quickstart-wizard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class QuickstartWizardComponent implements OnInit {

    public license: any;
    obsGithubUser: Observable<GitHubUser>;
    obsGitlabUser: Observable<GitLabUser>;
    obsBitbucketUser: Observable<BitbucketUser>;
    selectedRepos: any[] = [];
    obsRepoBranches: Branch[];
    githubUser: GitHubUser;
    gitlabUser: GitLabUser;
    bitbucketUser: BitbucketUser;
    loadingScan = false;
    entityId: string;

    activeTab = "1";

    private filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));

    constructor(
        private apiService: ApiService,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private taskService: TaskService,
        private spinner: NgxSpinnerService,
        public authService: AuthenticationService,
        private scanHelperService: ScanHelperService,
        private modalService: NgbModal) {
    }

    public ghUserCols = [
        { field: 'name', header: 'Name' }
    ];

    public demoForm = new FormGroup({
        files: this.filesControl
    });

    public toggleStatus() {
        this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
    }

    submitScan(repoType) {
        let scanRequest = new ScanRequest();
        scanRequest.repoType = repoType;
        // this.spinner.show();
        if (!this.entityId) {
            if (this.authService.currentUser) {
                this.entityId = this.authService.currentUser.defaultEntityId;
            }
        }
        console.log("SUBMITTING SCAN..");

        if (repoType === "github") {
            console.log("is github");
            // hack: find better way to handle the resource path.
            let resourcePath = this.selectedRepos[0].node.resourcePath.split("/", 3);
            let owner = resourcePath[1];
            let repo = resourcePath[2];
            let branch = this.selectedRepos[0].node.scanBranch;
            if (!branch) {
                branch = 'master';
            }
            scanRequest.login = owner;
            scanRequest.branch = branch;
            scanRequest.repository = repo;
        } else if (repoType === "gitlab") {
            console.log("is gitlab");
            let resourcePath = this.selectedRepos[0].fullPath.split("/", 3);
            scanRequest.login = resourcePath[0];
            scanRequest.repository = resourcePath[1];
            scanRequest.branch = this.selectedRepos[0].repository.rootRef;
            scanRequest.projectId = this.selectedRepos[0].id;
        } else {
            console.log("is bitbucket");
            let resourcePath = this.selectedRepos[0].fullName.split("/", 3);
            scanRequest.login = resourcePath[0];
            scanRequest.repository = resourcePath[1];
            let branch = this.selectedRepos[0].scanBranch;
            if (!branch) {
                branch = this.selectedRepos[0].mainBranch;
            }
            scanRequest.branch = branch;
        }
        console.log("BRANCH: ", scanRequest.branch);
        console.log("RPEO: ", scanRequest.repository);
        console.log("OWDER: ", scanRequest.login);
        scanRequest.entityId = this.entityId;
        this.taskService.scanRequest = scanRequest;
        console.log("SUBMITTING TASK..");
        //open dialog box with message..

        this.scanHelperService.submitingScanForProject();
        const modalRef = this.modalService.open(LoadingDialogComponent,
            {
                backdrop: 'static',
                keyboard: false,
            });
        modalRef.componentInstance.message = scanRequest.repository + ' Scan started';
        modalRef.componentInstance.projectName = scanRequest.repository;
        modalRef.componentInstance.entityId = this.entityId;
        
        // this.taskService.submitScanRequest()
        //     .pipe(map(task => task.data.task_submitScanRequest))
        //     .subscribe(task => {
        //         console.log("TASK TOKEN:", task);
        //         let sub = interval(1000).pipe(take(100)).subscribe(x => {
        //             this.taskService.getTaskUpdate(task.taskToken)
        //                 .pipe(map(taskUpdate => taskUpdate.data.task_update))
        //                 .subscribe(taskUpdate => {
        //                     console.log("STATUS:", taskUpdate.status);
        //                     if (taskUpdate.status === 'COMPLETE') {
        //                         sub.unsubscribe();
        //                         this.spinner.hide();
        //                         const projectId = taskUpdate.resourceId;
        //                         console.log("Task Complete: ", task);
        //                         debugger;
        //                         const url = "dashboard/entity/" + this.entityId + '/project/' + projectId;
        //                         this.router.navigate([url]);
        //                     }
        //                 });
        //         });
        //     });

        // Create new ScanRequest and set it in the TaskService
        // then forward to dashboard where we can display the task component.

        // this.router.navigate(['dashboard/quickstart/dashboard']);
    }

    loadGitHubUser() {
        console.log("Loading github user");
        this.loadingScan = true;
        this.obsGithubUser = this.apiService.getGitHubUser()
            .pipe(map(result => result.data.gitHubUser));
        this.obsGithubUser.subscribe(d => this.loadingScan = false);
    }


    // Load gitlab user data
    loadGitLabUser() {
        console.log("Loading gitlab user");
        this.loadingScan = true;
        this.obsGitlabUser = this.apiService.getGitLabUser()
            .pipe(map(result => result.data.gitLabUser));
        this.obsGitlabUser.subscribe(d => this.loadingScan = false);
    }


    // Load bitbucket user data
    loadBitbucketUser() {
        console.log("Loading bitbucket user");
        this.loadingScan = true;
        this.obsBitbucketUser = this.apiService.getBitbucketUser()
            .pipe(map(result => result.data.bitbucketUser));
        this.obsBitbucketUser.subscribe(d => this.loadingScan = false);
    }

    changeBranch(newValue) {
        console.log(newValue);
        this.selectedRepos[0].node.scanBranch = newValue;
    }

    licenseAttributeFilter(license: any, attributeType: string) {
        return license.attributes.filter(function (attribute) {
            return attribute.attributeType == attributeType;
        });
    }

    ngOnInit() {
        this.entityId = this.route.snapshot.paramMap.get('entityId');
        if (!this.entityId) {
            // https://github.com/threatrix/threat-center-ux/issues/5
            // NOTE: fix. We should have a current user here. Not sure why we dont.
            // this happens when we get here from the login page through github login
            if (this.authService.currentUser) {
                this.entityId = this.authService.currentUser.defaultEntityId;
            }
        }

        // this is hack to REMOVE the JWT token. This SHOULD be done in AuthGuard
        // but I need to figure out how to pull the relative URL and use
        // it for the replaceState URL, I think.
        console.log("IN QuickstartWizardComponent");
        let accessToken = this.authService.currentUser.accessToken;
        console.log("accessToken: " + accessToken);
        if (this.isEmail(accessToken)) {
            this.activeTab = "4";
        } else if (accessToken.startsWith("github-")) {
            this.loadGitHubUser();
            this.activeTab = "1";
        } else if (accessToken.startsWith("gitlab-")) {
            this.loadGitLabUser();
            this.activeTab = "2";
        } else if (accessToken.startsWith("bitbucket-")) {
            this.loadBitbucketUser();
            this.activeTab = "3";
        } else if (accessToken.startsWith("google-")) {
            this.activeTab = "4";
        }

        FilterUtils['custom'] = (value, filter): boolean => {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }
            if (value === undefined || value === null) {
                return false;
            }
            return parseInt(filter) > value;
        };
    }

    private isEmail(userName: string): boolean {
        let re = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
        return re.test(userName);
    }

}
