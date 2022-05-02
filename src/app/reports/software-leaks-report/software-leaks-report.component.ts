import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ScrollStateService} from "@app/shared/scroll-state.service";
import {compareByName} from "@app/shared/compare-utils";
import {uniqueElements, uniqueObjects} from "@app/shared/array-utils";
import { Entity } from '@app/models';
import { ReportService } from '@app/services/report.service';

@Component({
    selector: 'app-software-leaks-report',
    templateUrl: './software-leaks-report.component.html',
    styleUrls: ['./software-leaks-report.component.scss']
})
export class SoftwareLeaksReportComponent implements OnInit {
    reportDate = new Date();

    nameFilter: string;
    typeFilter = 'ALL';
    sourceFilter = 'ALL';
    statusFilter = 'ALL';

    previewStateOpen = false;

    totals = {entities: 0, projects: 0, leaks: 0};
    entities: Entity[];


    /*
        -   Asset Name
        -   Source
        -   Type(Partial, Asset, Project)
        -   Status
     */
    columns = ['Project', 'Asset name', 'Type', 'Status', 'Source'];

    dummyData = [
        {
            name:   'URLUtil.java',
            type:   'Partial',
            status: 'Removed',
            source: 'Pastebin (https://pastebin.com/G4Z1wyB9)',
        },
        {
            name:   'DataSourceUtils.java',
            type:   'Asset',
            status: 'Under Review',
            source: 'GitHub (https://github.com/npgall/concurrent-trees/blob/master/code/src/main/java/com/googlecode/concurrenttrees/common/KeyValuePair.java)',
        },
        {
            name:   'BootApp.java',
            type:   'Partial',
            status: 'Active',
            source: 'GitHub (https://github.com/npgall/concurrent-trees/blob/master/code/src/main/java/com/googlecode/concurrenttrees/common/PrettyPrinter.java)',
        },
    ];

    @Input() displayDataOnly: boolean;

    constructor(
        private reportService: ReportService,
        private scrollDisableService: ScrollStateService
    ) {
    }

    ngOnInit() {
        this.reportService.getAssets().subscribe(data => {
            this.entities = data.data.entities.edges.map((e) => e.node).sort(compareByName);

            this.totals = {entities: 0, projects: 0, leaks: 0};

            let dataNotAssigned = true;
            let maxAssetSize = 0;

            for (const entity of this.entities) {
                this.totals.entities += 1;
                this.totals.projects += entity.projects.edges.length;

                if (dataNotAssigned && entity.projects.edges.length > 0) {
                    // @ts-ignore
                    entity.projects.edges[0].node.leaks = this.dummyData;
                    // @ts-ignore
                    this.totals.leaks += entity.projects.edges[0].node.leaks.length;
                    dataNotAssigned = false;
                }
            }
        }, error => {
            console.error("SoftwareLeaksReportComponent", error);
        });
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
        if (!this.displayDataOnly && event.keyCode === 27) {
            this.closePreview();
            event.stopPropagation();
            event.preventDefault();
        }
    }

}
