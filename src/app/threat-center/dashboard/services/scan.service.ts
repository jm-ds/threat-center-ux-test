import { Injectable } from "@angular/core";
import { TaskService } from "@app/threat-center/shared/task/task.service";
import { BehaviorSubject, interval, Subscription } from "rxjs";
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ScanHelperService {

    private projectScanloadingStatus = new BehaviorSubject(null);
    projectScanloadingStatusObservable$ = this.projectScanloadingStatus.asObservable();
    sub: Subscription;
    constructor(private taskService: TaskService) {
    }

    public submitingScanForProject() {
        this.taskService.submitScanRequest()
            .pipe(map(task => task.data.task_submitScanRequest))
            .subscribe(task => {
                console.log("TASK TOKEN:", task);
                this.getTaskUpdate(task);
            });
    }

    private getTaskUpdate(task) {
        this.sub = interval(1000).pipe(take(100)).subscribe(x => {
            this.taskService.getTaskUpdate(task.taskToken)
                .pipe(map(taskUpdate => taskUpdate.data.task_update))
                .subscribe(taskUpdate => {
                    if (taskUpdate.status === 'COMPLETE') {
                        this.sub.unsubscribe();
                    }
                    // observable call to next in component
                    this.updateProjectScanLoadingStatus(taskUpdate.status, taskUpdate.resourceId);
                }, error => {
                    this.sub.unsubscribe();
                    this.updateProjectScanLoadingStatus("ERROR", null);
                });
        }, error => {
            this.sub.unsubscribe();
        });
    }

    public updateProjectScanLoadingStatus(message, projectId) {
        this.projectScanloadingStatus.next({ message: message, projectId: projectId });
    }

}