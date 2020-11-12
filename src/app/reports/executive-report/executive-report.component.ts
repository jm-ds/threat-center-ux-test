import {Component, HostListener, OnInit} from '@angular/core';
import {ScrollStateService} from "@app/shared/scroll-state.service";

@Component({
    selector: 'app-executive-report',
    templateUrl: './executive-report.component.html',
    styleUrls: ['./executive-report.component.scss']
})
export class ExecutiveReportComponent implements OnInit {

    reportDate = new Date();

    nameFilter: string;
    typeFilter = 'ALL';
    severityFilter = 'ALL';
    fixFilter = 'ALL';

    previewStateOpen = false;

    constructor(private scrollDisableService: ScrollStateService) {
    }

    ngOnInit() {
    }

    openPreview() {
        this.previewStateOpen = true;
        this.scrollDisableService.disableWindowScroll();
    }

    closePreview() {
        this.previewStateOpen = false;
        this.scrollDisableService.enableWindowScroll();
    }

    @HostListener('window:keydown', ['$event'])
    KeyDown(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.closePreview();
            event.stopPropagation();
            event.preventDefault();
        }
    }

}
