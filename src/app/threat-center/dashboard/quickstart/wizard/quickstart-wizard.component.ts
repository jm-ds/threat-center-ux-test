import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { FilterUtils } from 'primeng/utils';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { AuthenticationService } from '@app/security/services';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { HostListener } from '@angular/core';
import { ScanService } from '@app/services/scan.service';
import { TaskService } from '@app/services/task.service';
import { ScanHelperService } from '@app/services/scan-helper.service';
import { ReloadService } from '@app/services/reload.service';
import {
    BitbucketUser,
    Branch,
    GitHubUser,
    GitLabUser,
    ScanRequest,
    SnippetMatchResult
} from '@app/models';
import {BitbucketUser, Branch, GitHubUser, GitLabUser, ScanRequest, SnippetMatchResult, Task} from '@app/models';

import { UserPreferenceService } from '@app/services/core/user-preference.service';
import { RepositoryListComponent } from './repo-list/repo-list.component';
import { ReadyScanRepositorylistComponent } from './ready-scan-repo/ready-scan-repo.component';
import { LoadingDialogComponent } from '../../project-scan-dialog/loading-dialog.component';

import { environment } from 'environments/environment';

@Component({
    selector: 'app-quickstart',
    templateUrl: './quickstart-wizard.component.html',
    styleUrls: ['./quickstart-wizard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class QuickstartWizardComponent implements OnInit, OnDestroy {
  fileForm = this.fb.group({
    files: [
      undefined,
      [Validators.required, FileUploadValidators.filesLimit(1)]
    ]
  });

  private fileSubscription: Subscription;

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

    snippetText: string;
    matchCounter: number;
    languageType: string;
    obsSnippetMatch: Observable<SnippetMatchResult>;


    activeTab = "1";

    isDisableScanBtn: boolean = false;
    selectedItem: string = "";
    lastTabChangesInfo: NgbTabChangeEvent = undefined;

    @ViewChild('orgRepoList') orgRepoList: RepositoryListComponent;
    @ViewChild('repoList') private repoList: RepositoryListComponent;
    @ViewChild('gitLabRepoList') gitLabRepoList: RepositoryListComponent;
    @ViewChild('bitbucketRepoList') bitbucketRepoList: RepositoryListComponent;
    @ViewChild('readyScanRepo') readyScanRepo: ReadyScanRepositorylistComponent;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scanService: ScanService,
    private taskService: TaskService,
    private scanHelperService: ScanHelperService,
    private coreHelperService: CoreHelperService,
    private reloadService: ReloadService,
    private userPreferenceService: UserPreferenceService,
    public authService: AuthenticationService
  ) {
    this.scanHelperService.isEnabaleNewScanObservable$.subscribe(x => {
      this.isDisableScanBtn = x === null ? this.isDisableScanBtn : x;
    });
  }

  ngOnDestroy() {
    this.scanHelperService.isRefreshObjectPage.next(false);

    this.fileSubscription?.unsubscribe();
  }

    public ghUserCols = [{ field: 'name', header: 'Name' }];

  onSubmitScan(repoType: string) {
    const scanRequest = new ScanRequest();

    scanRequest.repoType = repoType;

    if (!this.entityId && this.authService.currentUser) {
      this.entityId = this.authService.currentUser.defaultEntityId;
    }

    console.log('Submitting scan…');

    console.log(`is ${repoType ?? 'default'}`);

    let resourcePath: string;
    let branch: string;

    switch (repoType) {
      case 'github':
        branch = this.selectedRepos[0].node.scanBranch;

        if (!branch) {
          branch = this.selectedRepos[0].node.defaultBranchRef.name;
        }

        scanRequest.branch = branch;

        // hack: find better way to handle the resource path.
        resourcePath = this.selectedRepos[0].node.resourcePath.split('/', 3);

        const [, owner, repo] = resourcePath;

        scanRequest.login = owner;
        scanRequest.repository = repo;

        break;

      case 'gitlab':
        resourcePath = this.selectedRepos[0].fullPath.split('/', 3);

        scanRequest.login = resourcePath[0];
        scanRequest.repository = resourcePath[1];
        scanRequest.branch = this.selectedRepos[0].repository.rootRef;
        scanRequest.projectId = this.selectedRepos[0].id;

        break;

      case 'bitbucket':
      default:
        resourcePath = this.selectedRepos[0].fullName.split('/', 3);

        scanRequest.login = resourcePath[0];
        scanRequest.repository = resourcePath[1];

        branch = this.selectedRepos[0].scanBranch;

        if (!branch) {
          branch = this.selectedRepos[0].mainBranch;
        }

        scanRequest.branch = branch;
    }

    console.log(`Branch: ${scanRequest.branch}`);
    console.log(`Repo: ${scanRequest.repository}`);
    console.log(`Owner: ${scanRequest.login}`);

    scanRequest.entityId = this.entityId;
    scanRequest.status = null;

    this.taskService.scanRequest = scanRequest;

    // Storing current scan to storage
    sessionStorage.setItem('REPO_SCAN', JSON.stringify(this.taskService.scanRequest));

    console.log('Submitting task…');

    // Open dialog box with message…
    this.isDisableScanBtn = true;

    // Starting Scaning process…
    this.reloadService.submitingRepoforScanStart(scanRequest, ' scan started.');
  }

  onSubmitFileForm() {
    this.fileSubscription?.unsubscribe();

    if (this.fileForm.invalid) {
      return;
    }

    const { files } = this.fileForm.value as {
      files: File[]
    };

    const formData = new FormData();

    files.forEach(file => {
      formData.append('multipartFile', file, file.name);
    });

    const headers = new HttpHeaders();

    headers.set('Content-Type', 'multipart/form-data');

    const options = { headers };

    this.fileSubscription = this.httpClient
      .post<Task>(`${environment.apiUrl}/project/upload`, formData, options)
      .subscribe(task => {
        this.scanHelperService.openFloatingModal(LoadingDialogComponent);
        this.scanHelperService.submitingUploadProject({
            uniqId: this.coreHelperService.uuidv4(),
            projectName: files[0].name,
            entityId: this.entityId,
            taskToken: task.taskToken,
        });
        this.scanHelperService.getTaskUpdate(task);
      });
  }

    submitSnippet() {
        console.log("SNIPPET", this.snippetText);
        console.log("LANG TYPE", this.languageType);

        this.obsSnippetMatch = this.scanService.getSnippetMatches(this.snippetText, this.languageType)
            .pipe(map(result => result.data.snippetMatchResult));
        this.obsSnippetMatch.subscribe(d => console.log(d));

    }


    loadGitHubUser() {
        console.log("Loading github user");
        this.loadingScan = true;
        this.obsGithubUser = this.scanService.getGitHubUser()
            .pipe(map(result => result.data.gitHubUser));
        this.obsGithubUser.subscribe(d => this.loadingScan = false);
    }


    // Load gitlab user data
    loadGitLabUser() {
        console.log("Loading gitlab user");
        this.loadingScan = true;
        this.obsGitlabUser = this.scanService.getGitLabUser()
            .pipe(map(result => {
                let user = result.data.gitLabUser;
                let avatar = user.avatarUrl;
                if (!avatar.startsWith("http")) {
                    avatar = "https://gitlab.com" + avatar;
                    user.avatarUrl = avatar;
                }
                return user;
            }));
        this.obsGitlabUser.subscribe(d => this.loadingScan = false);
    }


    // Load bitbucket user data
    loadBitbucketUser() {
        console.log("Loading bitbucket user");
        this.loadingScan = true;
        this.obsBitbucketUser = this.scanService.getBitbucketUser()
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

    refreshData() {
        if (this.activeTab === "Github" && this.authService.currentUser.repositoryAccounts.githubAccount) {
            this.loadGitHubUser();
        }
        else if (this.activeTab === "Gitlab" && this.authService.currentUser.repositoryAccounts.gitlabAccount) {
            this.loadGitLabUser();
        }
        else if (this.activeTab === "Bitbucket" && this.authService.currentUser.repositoryAccounts.bitbucketAccount) {
            this.loadBitbucketUser();
        } else { }
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
        if (!!this.authService.currentUser && !!this.authService.currentUser.repositoryAccounts) {
            let repositoryAccounts = this.authService.currentUser.repositoryAccounts;
            this.loadRepositoryUsers(repositoryAccounts);

            if (repositoryAccounts.githubAccount) {
              this.activeTab = 'Github';
            } else if (repositoryAccounts.gitlabAccount) {
              this.activeTab = 'Gitlab';
            } else if (repositoryAccounts.bitbucketAccount) {
              this.activeTab = "Bitbuclet";
            } else {
              this.activeTab = "DragDrop";
            }
        } else {
            console.error("Could not get repository accounts, user is not logged it or broken");
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
        this.getLastTabSelected();
    }

   /**
    * Filter by repository
    *
    * @param event input event
    */
   onRepositoryFilterInput(event: Event) {
    const { value } = event.target as HTMLInputElement;

    this.repoList.dataTableRef.filterGlobal(value, 'contains');
  }

    loadRepositoryUsers(repositoryAccounts: RepositoryAccounts) {
      if (repositoryAccounts.githubAccount) {
          this.loadGitHubUser();
      }
      if (repositoryAccounts.gitlabAccount) {
        this.loadGitLabUser();
      }
      if (repositoryAccounts.bitbucketAccount) {
        this.loadBitbucketUser();
      }
    }


    onRowSelect(event) {
        this.selectedRepos[0] = event.data;
        this.selectedItem = '';
        const selectRepo = this.selectedRepos[0];
        if (!!selectRepo) {

            if (!!selectRepo.node) {
                // for git hub
                if (!!selectRepo.node.defaultBranchRef && !!selectRepo.node.defaultBranchRef.name) {
                    this.selectedItem = selectRepo.node.defaultBranchRef.name;
                } else {
                    if (!!selectRepo.node.refs && selectRepo.node.refs.edges.length >= 1) {
                        const masterData = selectRepo.node.refs.edges.find(f => { return f.node.name == 'master' });
                        if (!!masterData) {
                            this.selectedItem = masterData.node.name;
                        } else {
                            const mainData = selectRepo.node.refs.edges.find(f => { return f.node.name == 'main' });
                            if (!!mainData) {
                                this.selectedItem = mainData.node.name;
                            }
                        }

                    }
                }
            } else {
                // for git lab..
                if (!!selectRepo.repository && !!selectRepo.repository.rootRef) {
                    this.selectedItem = selectRepo.repository.rootRef;
                }
                //for bit bucket..
                if (!!selectRepo.mainBranch) {
                    this.selectedItem = selectRepo.mainBranch;
                } else {
                    if (!!selectRepo.branches && selectRepo.branches.length >= 1) {
                        const masterData = selectRepo.branches.find(f => { return f === 'master' });
                        if (!!masterData) {
                            this.selectedItem = masterData;
                        } else {
                            const mainData = selectRepo.branches.find(f => { return f == 'main' });
                            if (!!mainData) {
                                this.selectedItem = mainData;
                            }
                        }
                    }
                }
            }
        }
        if (!!this.readyScanRepo) {
            this.readyScanRepo.selectedItem = this.selectedItem;
        }
    }

    onRowUnselect(event) {
        this.selectedRepos = [];
    }

    onTabChange($event: NgbTabChangeEvent) {
        this.lastTabChangesInfo = $event;
        this.activeTab = $event.nextId;
        this.userPreferenceService.settingUserPreference("ThreatScan", $event.activeId, this.activeTab);
        this.selectedItem = '';
        this.selectedRepos = [];
        if (!!this.readyScanRepo) {
            this.readyScanRepo.selectedItem = this.selectedItem;
        }
    }


    //Callled when component deactivate or destrory
    canDeactivate(): Observable<boolean> | boolean {
        //Need to check here is browser back button clicked or not if clicked then do below things..
        if (this.coreHelperService.getBrowserBackButton()) {
            this.coreHelperService.setBrowserBackButton(false);
            if (!!this.userPreferenceService.getPreviousTabSelectedByModule("ThreatScan")) {
                this.activeTab = this.userPreferenceService.getPreviousTabSelectedByModule("ThreatScan", true);
                this.userPreferenceService.settingUserPreference("ThreatScan", null, this.activeTab);
                return false;
            } else {
                this.userPreferenceService.settingUserPreference("ThreatScan", "", null);
                return true;
            }
        } else {
            // this.coreHelperService.settingUserPreference("ThreatScan", "", null);
            return true;
        }
    }

    //Below method will fire when click on browser back button.
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        this.coreHelperService.setBrowserBackButton(true);
        if (!!this.userPreferenceService.getPreviousTabSelectedByModule("ThreatScan")) {
            history.pushState(null, null, window.location.href);
        }
    }


    private isEmail(userName: string): boolean {
        let re = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
        return re.test(userName);
    }

    private getLastTabSelected() {
        this.activeTab = !!this.userPreferenceService.getLastTabSelectedNameByModule("ThreatScan") ? this.userPreferenceService.getLastTabSelectedNameByModule("ThreatScan") : this.activeTab;
    }
}
