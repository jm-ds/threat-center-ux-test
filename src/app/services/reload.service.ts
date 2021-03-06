import { Injectable } from "@angular/core";
import { LoadingDialogComponent } from "@app/threat-center/dashboard/project-scan-dialog/loading-dialog.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreHelperService } from "@app/services/core/core-helper.service";
import { ScanHelperService } from "@app/services/scan-helper.service";
import { TaskService } from "@app/services/task.service";


@Injectable({
    providedIn: 'root'
})

export class ReloadService {
    constructor(private coreHelperService: CoreHelperService, private scanHelperService: ScanHelperService, private modalService: NgbModal, private taskService: TaskService) {
        console.log("Reload Service called");
        //If user reload the page and any scan is in progress then we will do restart that process...
        if (!!sessionStorage.getItem('REPO_SCAN')) {
            const scanRequest = JSON.parse(sessionStorage.getItem('REPO_SCAN'));
            this.taskService.scanRequest = scanRequest;
            this.submitingRepoforScanStart(scanRequest,' scan restarted.');
        }
    }

    public submitingRepoforScanStart(scanRequest,message) {
        const preScanProjectData = {
            uniqId: this.coreHelperService.uuidv4(),
            message: scanRequest.repository + message,
            projectName: scanRequest.repository,
            entityId: scanRequest.entityId
        };
        this.scanHelperService.submitingCheckAlreadyScanned(preScanProjectData, LoadingDialogComponent);
    }

}