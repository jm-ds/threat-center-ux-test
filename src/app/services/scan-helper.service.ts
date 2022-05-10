import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, map, mergeMap, pluck } from 'rxjs/operators';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { ApolloQueryResult } from 'apollo-client';
import { NextConfig } from '@app/app-config';
import { Task, TaskQuery } from '@app/models';
import { MESSAGES } from '@app/messages/messages';

import { AlertService } from '@app/services/core/alert.service';
import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { TaskService } from '@app/services/task.service';

import { PreScanLoadingDialogComponent } from '@app/threat-center/dashboard/pre-scan-dialog/pre-scan-dialog.component';

@Injectable({
  providedIn: 'root'
})

export class ScanHelperService {

    private projectScanloadingStatus = new BehaviorSubject(null);
    projectScanloadingStatusObservable$ = this.projectScanloadingStatus.asObservable();

    private isHighlightNewScan = new BehaviorSubject(false);
    isHighlightNewScanObservable$ = this.isHighlightNewScan.asObservable();

    private isEnabaleNewScan = new BehaviorSubject(false);
    isEnabaleNewScanObservable$ = this.isEnabaleNewScan.asObservable();
    // private isRefreshObjectPage = new BehaviorSubject(false);
    isRefreshObjectPage = new BehaviorSubject(false);
    isRefreshObjectPageObservable$ = this.isRefreshObjectPage.asObservable();

    sub: Subscription;


    projectScanResults: Array<any> = [];
    recentlyScanCompleted: Array<any> = [];
    errorScanProject: Array<any> = [];

    constructor(
        private taskService: TaskService,
        private router: Router,
        private coreHelperService: CoreHelperService,
        private modalService: NgbModal,
        private alertService:AlertService,
        private coreGraphQLService: CoreGraphQLService) {
    }

    //Scan submit and get task token to do further for scan.
    public submitingScanForProject(preScanProjectData) {
        const object = {
            projectId: "",
            uniqId: preScanProjectData["uniqId"],
            projectName: preScanProjectData["projectName"],
            entityId: preScanProjectData["entityId"],
            scanStatus: "",
            taskToken: ""
        };

        this.projectScanResults.push(object);
        this.taskService.submitScanRequest()
            .pipe(map(task => task.data.task_submitScanRequest))
            .subscribe(task => {
                console.log("TASK TOKEN:", task);
                this.projectScanResults.forEach(pro => {
                    if (pro.uniqId == preScanProjectData['uniqId']) {
                        pro.taskToken = task.taskToken;
                    }
                });
                this.getTaskUpdate(task);
            });
    }

    public submitingUploadProject(preScanProjectData) {
        const object = {
            projectId: '',
            uniqId: preScanProjectData.uniqId,
            projectName: preScanProjectData.projectName,
            entityId: preScanProjectData.entityId,
            scanStatus: '',
            taskToken: preScanProjectData.taskToken
        };
        this.projectScanResults.push(object);
    }

    /**
     * Scan progress and get stats from server and updating needed thing status wise.
     *
     * @param task scan task
     */
    getTaskUpdate(task: Task) {
        this.taskService
          .getTaskUpdate(task.taskToken)
          .pipe(
            catchError((_, caught$) => caught$.pipe(
              mergeMap(query => {
                const errorTask = query.data.task_update;

                this.updatingDataWhileGetError(errorTask);

                this.alertService.alertBox(errorTask.statusMessage, MESSAGES.ERROR_TITLE, 'error');

                this.updateStorage(null);
                this.updateEnabaleNewScan(false);

                return EMPTY;
              })
            )),
            pluck<ApolloQueryResult<TaskQuery>, Task>('data.task_update')
          )
          .subscribe(tUpdate => {
                this.updateProjectArray(tUpdate);
                if (tUpdate.status === 'COMPLETE' || tUpdate.status === 'COMPLETE_WITH_ERRORS') {
                    //show toaster and pop one from main list and add into recent scan..
                    let obj = this.projectScanResults.find(pro => { return pro.taskToken === tUpdate.taskToken });
                    if (!!obj) {
                        obj['CompletedTime'] = new Date();
                        this.recentlyScanCompleted.push(obj);
                    }
                    this.projectScanResults = this.projectScanResults.filter(pro => { return pro.taskToken !== tUpdate.taskToken });
                    if (tUpdate.status === 'COMPLETE_WITH_ERRORS') {
                        const message = !!tUpdate.statusMessage ? tUpdate.statusMessage : "Scan is completed with errors";
                        this.alertService.alertBox(message, "Warning", "warning")
                            .then(() => {
                                this.highlightNewScanIfInSamePage(tUpdate);
                                this.refreshObjectPageIfFirstScan();
                            });
                    } else {
                        this.highlightNewScanIfInSamePage(tUpdate);
                        this.refreshObjectPageIfFirstScan();
                    }

                    //remove scan from storage
                    this.updateStorage(null);

                    //Update Execute Scan Button
                    this.updateEnabaleNewScan(false);
                } else if (tUpdate.status === 'ERROR') {
                    console.error("Task Error: ", tUpdate.statusMessage);
                    let obj = this.projectScanResults.find(pro => { return pro.taskToken === tUpdate.taskToken });
                    if (!!obj) {
                        obj['CompletedTime'] = new Date();
                        this.recentlyScanCompleted.push(obj);
                    }
                    this.projectScanResults = this.projectScanResults.filter(pro => { return pro.taskToken !== tUpdate.taskToken });
                    this.alertService.alertBox(tUpdate.statusMessage,MESSAGES.ERROR_TITLE,'error');

                    //remove scan from storage
                    this.updateStorage(null);
                    //Update Execute Scan Button
                    this.updateEnabaleNewScan(false);
                } else {
                    setTimeout(() => {
                        this.getTaskUpdate(task);
                    }, NextConfig.config.delaySeconds);
                    this.updateStorage(tUpdate.status);
                    //Update Execute Scan Button
                    this.updateEnabaleNewScan(true);
                }
            }, err => {
                this.updatingDataWhileGetError(task);
            });
    }

    //Highlite new scan on project page or not
    public updateIsHighlightNewScan(val) {
        this.isHighlightNewScan.next(val);
    }

    //Helper functions
    public updateProjectArray(taskUpdate) {
        this.projectScanResults.forEach(project => {
            if (taskUpdate.taskToken === project.taskToken) {
                project['projectId'] = taskUpdate.resourceId;
                project['scanStatus'] = taskUpdate.status;
            }
        });
    }

    //Helper function for scan
    public updatingDataWhileGetError(task) {
        const obj = this.projectScanResults.find(pro => { return pro.taskToken === task.taskToken });
        if (!!obj) {
            obj['CompletedTime'] = new Date();
            this.errorScanProject.push(obj);
        }
        this.projectScanResults = this.projectScanResults.filter(pro => { return pro.taskToken !== task.taskToken });
    }

    //Navigate to project page when click on prject from floating model
    public gotoProjectAndUpdateRecentScan(project) {
        this.recentlyScanCompleted = this.recentlyScanCompleted.filter(pro => { return pro.projectId !== project.projectId });
        const url = "dashboard/entity/" + project.entityId + "/project/" + project.projectId;
        this.router.navigate([url], { state: { from: "DIALOG" } });
    }

    public openScanModel(preScanProjectData): NgbModalRef {
        const modalRef = this.modalService.open(PreScanLoadingDialogComponent,
            {
                backdrop: 'static',
                keyboard: false,
                windowClass: 'pre-scan-loading-dialog',
                backdropClass: 'pre-scan-loading-dialog-backdrop'
            });
        modalRef.componentInstance.preScanProjectData = preScanProjectData;
        return modalRef;
    }

  /** Check if latest commit for a branch was scanned already and run scan. */
  public submitingCheckAlreadyScanned(preScanProjectData: any, LoadingDialogComponent: any) {
    this.taskService
      .checkAlreadyScannedProject(
        this.checkScannedErrorHandler.bind(this, 'ScanHelperService#submitingCheckAlreadyScanned')
      )
      .pipe(
        pluck('data.checkAlreadyScannedProject'),
        catchError(
          this.checkScannedErrorHandler.bind(this, 'ScanHelperService#submitingCheckAlreadyScanned')
        )
      )
      .subscribe(check => {
        if (check) {
          Swal.close();
          const lastCheckDate = moment(check)
            .format('MM/DD/YYYY h:mm a');

          const alertTitle = `Project was scanned already at ${lastCheckDate}`;
          const alertText = 'Do you want to scan anyway?';

          this.alertService
            .alertConfirm(alertTitle, alertText, 'question', true, true, '#4680ff', '#6c757d', 'Yes', 'No')
            .then(({ value }) => {
              if (value) {
                // run scan
                this.runScan(preScanProjectData, LoadingDialogComponent);
              } else {
                // cancel scan
                this.updateStorage(null);
                this.updateEnabaleNewScan(false);
              }
            });
        } else {
          // run scan
          this.runScan(preScanProjectData, LoadingDialogComponent);
        }
      });
  }

  private checkScannedErrorHandler(errorSource: string, error: HttpErrorResponse | any, source: Observable<any>) {
    // cancel scan
    this.updateStorage(null);
    this.updateEnabaleNewScan(false);

    // default error handler
    return this.coreGraphQLService.errorHandler(errorSource, error, source);
  }


    // run scan
    private runScan(preScanProjectData, LoadingDialogComponent) {
        this.openScanModel(preScanProjectData).result.then((result) => {
          this.openFloatingModal(LoadingDialogComponent);
        }, (reason) => { });
        this.submitingScanForProject(preScanProjectData);
    }

    //floating model for scan...
    public openFloatingModal(loadingDialogComponent) {
        const modalRef = this.modalService.open(loadingDialogComponent, {
            backdrop: 'static',
            keyboard: false,
            windowClass: 'loading-dialog',
            backdropClass: 'loading-dialog-backdrop'
        });
    }

    //helper function.
    private highlightNewScanIfInSamePage = (tUpdate) => {
        const projectId = tUpdate.resourceId;
        const lastSegOfUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        if (!!projectId && !!lastSegOfUrl && projectId === lastSegOfUrl) {
            this.updateIsHighlightNewScan(true);
        } else {
            this.updateIsHighlightNewScan(false);
        }
    }

    //execute scan button diable and enebale
    private updateEnabaleNewScan(val: boolean) {
        this.isEnabaleNewScan.next(val);
    }

    //refresh entity page if fisrt scan.
    private refreshObjectPageIfFirstScan() {
        this.isRefreshObjectPage.next(true);
    }

    //store current scan to storage. and remove if scan complete or get wny error...
    private updateStorage(status) {
        if (!!sessionStorage.getItem('REPO_SCAN')) {
            if (!!status) {
                let item = JSON.parse(sessionStorage.getItem('REPO_SCAN'));
                item['status'] = status;
                sessionStorage.setItem('REPO_SCAN', JSON.stringify(item));
            } else {
                sessionStorage.removeItem('REPO_SCAN');
            }
        }
    }
}