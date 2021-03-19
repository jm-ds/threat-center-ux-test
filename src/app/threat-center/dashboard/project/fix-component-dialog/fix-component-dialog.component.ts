import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FixComponentResultDialogComponent} from "@app/threat-center/dashboard/project/fix-component-result-dialog/fix-component-result-dialog.component";
import {FixService} from "@app/threat-center/dashboard/project/services/fix.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Observable} from "rxjs";
import { FixResult } from '@app/models';


@Component({
    selector: 'app-fix-component-dialog',
    templateUrl: './fix-component-dialog.component.html',
    styleUrls: ['./fix-component-dialog.component.scss']
})
export class FixComponentDialogComponent implements OnInit {
    scanId;
    newVersion: string;
    oldVersion: string;
    componentId;

    fixResultObservable: Observable<FixResult[]>;

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private fixService: FixService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
    }

    fixVersion() {
        this.spinner.show();
        this.fixResultObservable = this.fixService.fixComponentVersion(this.scanId, this.componentId, this.oldVersion, this.newVersion);
        this.fixResultObservable.subscribe(results => {
            this.spinner.hide();
            const modalRef = this.modalService.open(FixComponentResultDialogComponent, {
                keyboard: false,
            });
            modalRef.componentInstance.fixResults = results;
        });
    }

    closeBtn() {
        this.activeModal.close();
    }
}
