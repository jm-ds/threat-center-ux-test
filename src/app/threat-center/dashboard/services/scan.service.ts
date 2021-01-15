import { Injectable, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { CoreHelperService } from "@app/core/services/core-helper.service";
import { TaskService } from "@app/threat-center/shared/task/task.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, interval, Subscription } from "rxjs";
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ScanHelperService {

    private projectScanloadingStatus = new BehaviorSubject(null);
    projectScanloadingStatusObservable$ = this.projectScanloadingStatus.asObservable();

    private isHighlightNewScan = new BehaviorSubject(false);
    isHighlightNewScanObservable$ = this.isHighlightNewScan.asObservable();

    sub: Subscription;


    projectScanResults: Array<any> = [];
    recentlyScanCompleted: Array<any> = [];
    errorScanProject: Array<any> = [];

    constructor(
        private taskService: TaskService,
        private router: Router,
        private modalService: NgbModal,
        private coreHelperService: CoreHelperService,) {
    }

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
                        this.coreHelperService.swalALertBox("Scan is completed with errors", "Warning", "warning").then(() => this.highlightNewScanIfInSamePage(tUpdate));
                    } else {
                        this.highlightNewScanIfInSamePage(tUpdate);
                    }
                } else if (tUpdate.status === 'ERROR') {
                    console.error("Task Error: ", tUpdate.statusMessage);
                    this.coreHelperService.swalALertBox(tUpdate.statusMessage);
                } else {
                    this.getTaskUpdate(task);
                }
            }, err => {
                this.updatingDataWhileGetError(task);
            });
    }

    public updateIsHighlightNewScan(val) {
        this.isHighlightNewScan.next(val);
    }

    public updateProjectArray(taskUpdate) {
        this.projectScanResults.forEach(project => {
            if (taskUpdate.taskToken === project.taskToken) {
                project['projectId'] = taskUpdate.resourceId;
                project['scanStatus'] = taskUpdate.status;
            }
        });
    }

    public updatingDataWhileGetError(task) {
        const obj = this.projectScanResults.find(pro => { return pro.taskToken === task.taskToken });
        if (!!obj) {
            obj['CompletedTime'] = new Date();
            this.errorScanProject.push(obj);
        }
        this.projectScanResults = this.projectScanResults.filter(pro => { return pro.taskToken !== task.taskToken });
    }


    public gotoProjectAndUpdateRecentScan(project) {
        this.recentlyScanCompleted = this.recentlyScanCompleted.filter(pro => { return pro.projectId !== project.projectId });
        const url = "dashboard/entity/" + project.entityId + "/project/" + project.projectId;
        this.router.navigate([url], { state: { from: "DIALOG" } });
    }

    private highlightNewScanIfInSamePage = (tUpdate) => {
        const projectId = tUpdate.resourceId;
        const lastSegOfUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        if (!!projectId && !!lastSegOfUrl && projectId === lastSegOfUrl) {
            this.updateIsHighlightNewScan(true);
        } else {
            this.updateIsHighlightNewScan(false);
        }
    }

}