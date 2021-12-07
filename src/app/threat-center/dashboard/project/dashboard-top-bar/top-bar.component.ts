import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Project } from "@app/models";
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
    constructor() {
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

}