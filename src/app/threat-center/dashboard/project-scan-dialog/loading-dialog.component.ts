import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScanHelperService } from "../services/scan.service";

@Component({
    selector: 'app-project-scan-loading',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoadingDialogComponent implements OnInit {

    @Input() message: string = "";
    @Input() projectName: string = "";
    isMessageButtonClick: boolean = false;
    isError: boolean = false;

    statusMessageFromback: string = "";
    constructor
        (private scanHelperService: ScanHelperService,
            public activeModal: NgbActiveModal,
            private route: ActivatedRoute,
            private router: Router
        ) {

        this.scanHelperService.projectScanloadingStatusObservable$
            .subscribe(x => {
                const lastSegOfUrl = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
                console.log(lastSegOfUrl);
                if (!!x) {
                    this.statusMessageFromback = x['message'];

                    if (this.statusMessageFromback === 'ERROR') {
                        // If ANY error from server/api side.
                        this.isError = true;
                    } else {
                        this.isError = false;
                        // no error from api side...
                        if (!!lastSegOfUrl && !!x['projectId'] && lastSegOfUrl === x['projectId'] &&
                            x['message'] === 'COMPLETE') {
                            // close dialog box and get latest scan and highlted in project screen...
                        } else {
                            // change message and add link to go into project page.
                        }
                    }
                }
            });
    }
    ngOnInit(): void {

    }

}