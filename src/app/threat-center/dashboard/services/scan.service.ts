import { Injectable, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { NextConfig } from "@app/app-config";
import { CoreHelperService } from "@app/core/services/core-helper.service";
import { TaskService } from "@app/threat-center/shared/task/task.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Subscription } from "rxjs";
import { map } from 'rxjs/operators';

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
        private modalService: NgbModal) {
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

    //Scan progress and get stats from server and updating needed thing status wise.
    getTaskUpdate(task) {
        this.taskService.getTaskUpdate(task.taskToken)
            .pipe(map(taskUpdate => taskUpdate.data.task_update))
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
                        this.coreHelperService.swalALertBox("Scan is completed with errors", "Warning", "warning")
                            .then(() => {
                                this.highlightNewScanIfInSamePage(tUpdate);
                                this.refreshObjectPageIfFirstScan();
                            });
                    } else {
                        this.highlightNewScanIfInSamePage(tUpdate);
                        this.refreshObjectPageIfFirstScan();
                    }

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
                    this.coreHelperService.swalALertBox(tUpdate.statusMessage);

                    //Update Execute Scan Button
                    this.updateEnabaleNewScan(false);
                } else {
                    setTimeout(() => {
                        this.getTaskUpdate(task);
                    }, NextConfig.config.delaySeconds);

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

}