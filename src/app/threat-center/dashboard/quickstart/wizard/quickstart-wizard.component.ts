import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { FilterUtils } from 'primeng/utils';

import { Observable,interval  } from 'rxjs';
import { debounceTime,map,filter,startWith,take,takeWhile } from 'rxjs/operators';
import gql from 'graphql-tag';
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { GitHubUser, Organization, Repository, Language, Branch,ScanRequest } from '@app/threat-center/shared/models/types';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {TaskService} from '@app/threat-center/shared/task/task.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgxSpinnerService } from "ngx-spinner";
import {AuthenticationService} from '@app/security/services';

@Component({
  selector: 'app-quickstart',
  templateUrl: './quickstart-wizard.component.html',
  styleUrls: ['./quickstart-wizard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuickstartWizardComponent implements OnInit {


  public license:any;
  obsGithubUser:Observable<GitHubUser>;
  selectedRepos: any[]=[];
  obsRepoBranches:Branch[];
  githubUser:GitHubUser;
  loadingScan=false;
  entityId:string;

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));

  constructor(
    private apiService:ApiService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private taskService:TaskService,
    private spinner: NgxSpinnerService,
    public authService:AuthenticationService){ }

  public ghUserCols = [
      { field: 'name', header: 'Name'}
  ];

  public demoForm = new FormGroup({
    files: this.filesControl
  });

  public toggleStatus() {
    this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
  }

  submitScan() {
    if(!this.entityId) {
        if(this.authService.currentUser)
          this.entityId = this.authService.currentUser.defaultEntityId;
    }
    //this.loadingScan = true;
    this.spinner.show();
    console.log("SUBMITTING SCAN..")
    //hack: find better way to handle the resource path.
    let resourcePath = this.selectedRepos[0].node.resourcePath.split("/", 3);
    let owner = resourcePath[1];
    let repo = resourcePath[2];
    let branch = this.selectedRepos[0].scanBranch;
    if(!branch)
      branch = 'master';

    console.log("ENTITYID: ", this.entityId)
    console.log("BRANCH: ",branch)
    console.log("RPEO: ",repo)
    console.log("OWDER: ",owner)

    let scanRequest = new ScanRequest();
    scanRequest.login = owner;
    scanRequest.branch = branch;
    scanRequest.repository = repo;
    scanRequest.entityId = this.entityId;

    this.taskService.scanRequest = scanRequest;

    console.log("SUBMITTING TASK..")
    this.taskService.submitScanRequest()
    .pipe(map(task => task.data.task_submitScanRequest))
    .subscribe(task => {
      console.log("TASK TOKEN:",task);
      let sub = interval(1000).pipe(take(100)).subscribe(x => {
        this.taskService.getTaskUpdate(task.taskToken)
          .pipe(map(taskUpdate => taskUpdate.data.task_update))
          .subscribe(taskUpdate => {
            console.log("STATUS:",taskUpdate.status);
            if(taskUpdate.status === 'COMPLETE') {
              sub.unsubscribe();
              this.spinner.hide();
              const projectId = taskUpdate.resourceId;
              console.log("Task Complete: ",task)
              //this.router.navigate(['/dashboard/entity',this.entityId]);
              this.router.navigate(['/dashboard/project',projectId]);
            }
          });
      });
    });

    // Create new ScanRequest and set it in the TaskService
    // then forward to dashboard where we can display the task component.

    //this.router.navigate(['dashboard/quickstart/dashboard']);
  }

  loadGitHubUser() {
    console.log("Loading github user");

    this.obsGithubUser = this.apiService.getGitHubUser()
    .pipe(map(result => result.data.gitHubUser));
  }

  changeBranch(newValue) {
    console.log(newValue);
    this.selectedRepos[0].scanBranch=newValue;
  }

  licenseAttributeFilter(license:any, attributeType:string) {
    return license.attributes.filter(function(attribute) {
      return attribute.attributeType == attributeType;
    });
  }

  ngOnInit() {
    this.entityId = this.route.snapshot.paramMap.get('entityId');
    if(!this.entityId) {
      //https://github.com/threatrix/threat-center-ux/issues/5
      //NOTE: fix. We should have a current user here. Not sure why we dont.
      // this happens when we get here from the login page through github login
      if(this.authService.currentUser)
        this.entityId = this.authService.currentUser.defaultEntityId;
    }

    // this is hack to REMOVE the JWT token. This SHOULD be done in AuthGuard
    // but I need to figure out how to pull the relative URL and use
    // it for the replaceState URL, I think.
    console.log("IN QuickstartWizardComponent");
    this.location.replaceState('/dashboard/quickstart');

    this.loadGitHubUser();
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
          return true;
      }
      if (value === undefined || value === null) {
          return false;
      }
      return parseInt(filter) > value;
    }
  }

}
