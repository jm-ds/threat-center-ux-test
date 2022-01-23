import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Project } from "@app/models";
import { UserPreferenceService } from "@app/services/core/user-preference.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

@Component({
    selector: 'project-dashboard-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss']
})

export class ProjectDashboardTopbarComponent implements OnInit, OnDestroy {

    @Input() set obsProject(val: Observable<Project>) {
        this.initMostRecentScan(val);
    }

    @Output() openScanTab: EventEmitter<any> = new EventEmitter();

    mostRecentScan;
    errorMsg: string;
    log: string;
    totalScanCount = 0;

    constructor(private modalService: NgbModal,private userPreferenceService: UserPreferenceService) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }

    initMostRecentScan(val: Observable<Project>) {
        if (val) {
            val.subscribe(res => {
                this.totalScanCount = res.scans.totalCount;
                if (res && res.scans.edges.length >= 1) {
                    const lastScanSelected = this.userPreferenceService.getLastScanSelectedByModule("Project");
                    if (!!lastScanSelected && !!lastScanSelected.lastSelectedScanId && lastScanSelected.lastSelectedScanId !== '') {
                        this.mostRecentScan = res.scans.edges.find(d => { return d.node.scanId === lastScanSelected.lastSelectedScanId })
                    } else {
                        this.mostRecentScan = res.scans.edges.reduce((a: any, b: any) => (a.node.created > b.node.created ? a : b));
                    }
                }
            });
        }
    }

    updateData(scan) {
        this.mostRecentScan = scan;
    }

    openLogs(content, errorMsg: string, log: string) {
        // open logs popup
        this.errorMsg = errorMsg;
        this.log = log;
        this.modalService.open(content, { windowClass: 'md-class', centered: true });
    }

    openScanTable() {
        this.openScanTab.emit('');
    }

}