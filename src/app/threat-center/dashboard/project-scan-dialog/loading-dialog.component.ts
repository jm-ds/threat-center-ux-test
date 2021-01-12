import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScanHelperService } from "../services/scan.service";
import * as $ from 'jquery'
import { interval, Subscription } from "rxjs";
import { NextConfig } from "@app/app-config";


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

    successToasterTime: number = NextConfig.config.successToasterTime;
    errorToasterTime: number = NextConfig.config.errorToasterTime;
    closePopup:number = NextConfig.config.closePopup;

    startTimerToCloseModel: Date | any = null;
    constructor
        (
            private scanHelperService: ScanHelperService,
            public activeModal: NgbActiveModal,
    ) {

        const source = interval(100);
        this.subscription = source.subscribe(d => {
            this.projectScanResults = this.scanHelperService.projectScanResults;
            this.recentlyScanCompleted = this.scanHelperService.recentlyScanCompleted;
            this.errorScanProject = this.scanHelperService.errorScanProject;
            this.closeModelIfNoScanInProgress();
            if (this.projectScanResults.length == 0 && this.recentlyScanCompleted.length == 0 && this.errorScanProject.length == 0) {
                this.closeModel();
            }

        });
    }

    filter(items): Array<any> {
        if (!!items && items.length >= 1) {
            const cDate: any = new Date();
            return items.filter(pro => {
                return ((cDate - pro['CompletedTime']) / 1000) < this.successToasterTime;
            });
        } else {
            return [];
        }
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

    closeModelIfNoScanInProgress() {
        if (this.projectScanResults.length == 0) {
            if (!this.startTimerToCloseModel) {
                this.startTimerToCloseModel = new Date();
            }
        } else {
            this.startTimerToCloseModel = undefined;
        }
        const cDate: any = new Date();
        if (!!this.startTimerToCloseModel) {
            if ((cDate - this.startTimerToCloseModel) / 1000 > this.closePopup) {
                this.closeModel();
            }
        }
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