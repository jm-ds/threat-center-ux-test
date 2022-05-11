import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { NgbActiveModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

import { NextConfig } from '@app/app-config';

import { ScanHelperService } from '@app/services/scan-helper.service';
import { UserPreferenceService } from '@app/services/core/user-preference.service';

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
    closePopup: number = NextConfig.config.closePopup;

    startTimerToCloseModel: Date | any = null;

    constructor(
        private scanHelperService: ScanHelperService,
        public activeModal: NgbActiveModal,
        private userPreferenceService: UserPreferenceService
    ) {

        const source = interval(100);
        this.subscription = source.subscribe(d => {
            this.projectScanResults = this.scanHelperService.projectScanResults;
            this.recentlyScanCompleted = this.scanHelperService.recentlyScanCompleted;
            this.errorScanProject = this.scanHelperService.errorScanProject;
            this.closeModelIfNoScanInProgress();

            if (this.recentlyScanCompleted.length >= 1) {
                if (!this.filterRecentlyCompletedproject()) {
                    this.closeModel();
                }
            }

            const filteredErrors = this.filterErrorPro(this.errorScanProject);

            if (this.projectScanResults.length === 0 && this.recentlyScanCompleted.length === 0 && filteredErrors.length === 0) {
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
        return [...new Map(this.recentlyScanCompleted.filter(f => !!f['projectId'] && f['projectId'] !== '').map(item => [item['projectId'], item])).values()];
    }

    filterRecentlyCompletedproject() {
        return !!this.recentlyScanCompleted.find(f => !!f['projectId'] && f['projectId'] !== '');
    }

    ngOnDestroy(): void {
        this.subscription && this.subscription.unsubscribe();
        $('body').removeClass("loading-float");
        this.scanHelperService.errorScanProject = [];
    }

    ngOnInit(): void {
        $('body').addClass("loading-float");
    }

  /**
   * Go to the project after scan
   *
   * @param project scanned project
   */
  goToProject(project: unknown) {
    // empty string for `lastSelectedScan` implies no selected scan
    this.userPreferenceService.settingUserPreference('Project', null, null, null, null, null, null, '');
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

    public beforeChange($event: NgbPanelChangeEvent) {
        if ($event.panelId === 'preventchange-2' && this.projectScanResults.length === 1) {
            $event.preventDefault();
        }
    }

}
