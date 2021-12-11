import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Project } from "@app/models";
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
    mostRecentScan;
    errorMsg: string;
    log: string;

    constructor(private modalService: NgbModal) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }

    initMostRecentScan(val: Observable<Project>) {
        if (val) {
            val.subscribe(res => {
                if (res && res.scans.edges.length >= 1) {
                    this.mostRecentScan = res.scans.edges.reduce((a: any, b: any) => (a.node.created > b.node.created ? a : b));
                }
                console.log(this.mostRecentScan);
            });
        }
    }

    openLogs(content, errorMsg: string, log: string) {
        // open logs popup
        this.errorMsg = errorMsg;
        this.log = log;
        this.modalService.open(content, { windowClass: 'md-class', centered: true });
    }

}