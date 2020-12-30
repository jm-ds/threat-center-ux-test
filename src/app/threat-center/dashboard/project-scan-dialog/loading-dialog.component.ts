import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScanHelperService } from "../services/scan.service";
import * as $ from 'jquery'

@Component({
    selector: 'app-project-scan-loading',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoadingDialogComponent implements OnInit, OnDestroy {

    @Input() message: string = "";
    @Input() projectName: string = "";
    @Input() entityId: string = "";

    isMessageButtonClick: boolean = false;
    isError: boolean = false;

    statusMessageFromback: string = "";
    projectId: string = "";
    constructor
        (
            private scanHelperService: ScanHelperService,
            public activeModal: NgbActiveModal,
            private route: ActivatedRoute,
            private router: Router
        ) {

        this.scanHelperService.projectScanloadingStatusObservable$
            .subscribe(x => {
                const lastSegOfUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
                if (!!x) {
                    this.statusMessageFromback = x['message'];
                    if (this.statusMessageFromback === 'ERROR') {
                        // If ANY error from server/api side.
                        this.isError = true;
                        this.statusMessageFromback = "Something went wrong!";
                    } else {
                        // IF NO ERROR FROM API SIDE.
                        this.isError = false;
                        this.projectId = x['projectId'];
                        if (!!lastSegOfUrl && !!x['projectId'] && lastSegOfUrl === x['projectId'] &&
                            x['message'] === 'COMPLETE') {
                            // CLOSE DIALOG BOX THEN GET LATEST SCAN AND HIGHLTED IN PROJECT SCREEN.
                            this.scanHelperService.updateIsHighlightNewScan(true);
                            this.activeModal.dismiss();
                        } else {
                            // CHANGE MESSAGE AND GO TO LINK FOR THE PROJECT PAGE.
                            this.scanHelperService.updateIsHighlightNewScan(false);
                            // think rest of the things will handle by html
                        }
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.isError = false;
        $('body').removeClass("loading-float");
    }

    ngOnInit(): void {
        this.isError = false;
        this.isMessageButtonClick = false;
    }

    gotItBtn() {
        $('body').addClass("loading-float");
    }

    gotoProjectPage() {
        this.activeModal.dismiss();
        const url = "dashboard/entity/" + this.entityId + "/project/" + this.projectId;
        this.router.navigate([url], { state: { from: "DIALOG" } });
    }

    closeModel() {
        this.isError = false;
        this.isMessageButtonClick = false;
        this.activeModal.close();
    }

}