import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScanHelperService } from "../services/scan.service";
import * as $ from 'jquery'
import { interval, Subscription } from "rxjs";


@Component({
    selector: 'app-project-scan-loading',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoadingDialogComponent implements OnInit, OnDestroy {

    projectScanResults: Array<any> = [];
    recentlyScanCompleted: Array<any> = [];
    errorScanProject: Array<any> = [];

    subscription: Subscription;

    successToasterTime: number = 5;
    errorToasterTime: number = 5;
    constructor
        (
            private scanHelperService: ScanHelperService,
            public activeModal: NgbActiveModal,
            private route: ActivatedRoute,
            private router: Router,
    ) {

        const source = interval(100);
        this.subscription = source.subscribe(d => {
            this.projectScanResults = this.scanHelperService.projectScanResults;
            this.recentlyScanCompleted = this.scanHelperService.recentlyScanCompleted;

            this.errorScanProject = this.scanHelperService.errorScanProject;
            if (this.projectScanResults.length == 0 && this.recentlyScanCompleted.length == 0 && this.errorScanProject.length == 0) {
                this.closeModel();
            }
        });

        // this.scanHelperService.projectScanloadingStatusObservable$
        //     .subscribe(x => {
        //         const lastSegOfUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        //         if (!!x) {
        //             this.statusMessageFromback = x['message'];
        //             if (this.statusMessageFromback === 'ERROR') {
        //                 // If ANY error from server/api side.
        //                 this.isError = true;
        //                 this.statusMessageFromback = "Something went wrong!";
        //             } else {
        //                 // IF NO ERROR FROM API SIDE.
        //                 this.isError = false;
        //                 this.projectId = x['projectId'];
        //                 if (!!lastSegOfUrl && !!x['projectId'] && lastSegOfUrl === x['projectId'] &&
        //                     x['message'] === 'COMPLETE') {
        //                     // CLOSE DIALOG BOX THEN GET LATEST SCAN AND HIGHLTED IN PROJECT SCREEN.
        //                     this.scanHelperService.updateIsHighlightNewScan(true);
        //                     this.activeModal.dismiss();
        //                 } else {
        //                     // CHANGE MESSAGE AND GO TO LINK FOR THE PROJECT PAGE.
        //                     this.scanHelperService.updateIsHighlightNewScan(false);
        //                     // think rest of the things will handle by html
        //                 }
        //             }
        //         }
        //     });

    }

    filter(items): Array<any> {
        const cDate: any = new Date();
        return items.filter(pro => {
            return ((cDate - pro['CompletedTime']) / 1000) < this.successToasterTime;
        });
    }

    filterErrorPro(items): Array<any> {
        const cDate: any = new Date();
        return items.filter(pro => {
            return ((cDate - pro['CompletedTime']) / 1000) < this.errorToasterTime;
        });
    }

    filterUniqRecords() {
        return [...new Map(this.recentlyScanCompleted.map(item => [item['projectId'], item])).values()];
    }

    ngOnDestroy(): void {
        this.subscription && this.subscription.unsubscribe();
        $('body').removeClass("loading-float");
        this.scanHelperService.errorScanProject = [];
    }

    ngOnInit(): void {
        $('body').addClass("loading-float");
    }

    gotoProject(project) {
        this.scanHelperService.gotoProjectAndUpdateRecentScan(project);
    }

    closeModel() {
        this.scanHelperService.projectScanResults = [];
        this.scanHelperService.recentlyScanCompleted = [];
        this.scanHelperService.errorScanProject = [];
        this.projectScanResults = [];
        this.recentlyScanCompleted = [];
        this.errorScanProject = [];
        this.activeModal.close();
    }

}