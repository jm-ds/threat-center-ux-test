import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-pre-scan-loading',
    templateUrl: './pre-scan-dialog.component.html',
    styleUrls: ['./pre-scan-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PreScanLoadingDialogComponent implements OnInit, OnDestroy {

    @Input() preScanProjectData: any = {};
    scanPoPuptimeout: number = 3000;

    constructor(
            public activeModal: NgbActiveModal,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.gotItBtn();
        }, this.scanPoPuptimeout)
    }

    gotItBtn() {
        this.activeModal.close();
    }

}
