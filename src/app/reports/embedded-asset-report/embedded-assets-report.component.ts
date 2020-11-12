import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Entity} from "@app/threat-center/shared/models/types";
import {ReportService} from "@app/reports/report.service";
import {ScrollStateService} from "@app/shared/scroll-state.service";
import {compareByName} from "@app/shared/compare-utils";
import {NouiFormatter} from "ng2-nouislider";


export class FileSizeSliderFormatter implements NouiFormatter {
    public label = "B";

    to(value: number): string {
        value = Math.round(value);
        return value + this.label;
    }

    from(value: string): number {
        return 0;
    }
}


@Component({
    selector: 'app-embedded-asset-report',
    templateUrl: './embedded-assets-report.component.html',
    styleUrls: ['./embedded-assets-report.component.scss']
})
export class EmbeddedAssetsReportComponent implements OnInit {

    @Input()
    displayDataOnly: false;

    reportDate = new Date();

    nameFilter: string;
    statusFilter = 'ALL';

    // @ts-ignore
    @ViewChild('sizeFilterRef') sizeFilterRef;
    public sizeFilter: number[] = [0, 20];
    public sizeFilterConfig: any = {
        behaviour: 'drag',
        connect: true,
        margin: 1,
        // limit: 5,
        range: {
            min: 0,
            max: 10
        },
        pips: {
            mode: 'steps',
            density: 10,
            format: new FileSizeSliderFormatter()
        }
    };

    public embeddedFilter: number[] = [10, 100];
    public embeddedFilterConfig: any = {
        behaviour: 'drag',
        connect: true,
        margin: 1,
        // limit: 5,
        range: {
            min: 0,
            max: 100
        },
        pips: {
            mode: 'steps',
            density: 10
        }
    };

    previewStateOpen = false;

    totals = {entities: 0, embedded: 0, projects: 0};
    entities: Entity[];


    /*
        -   Name
        -   Size
        -   Status
        -   Embedded
     */
    columns = ['Project', 'File Name', 'File Size', 'Workspace Path', 'Status', 'Embedded Assets'];


    constructor(private reportService: ReportService,
                private scrollDisableService: ScrollStateService
    ) {
        this.reportService.getAssets().subscribe(data => {
            this.entities = data.data.entities.edges.map((e) => e.node).sort(compareByName);

            this.totals = {entities: 0, embedded: 0, projects: 0};

            let maxAssetSize = 0;

            for (const entity of this.entities) {
                this.totals.entities += 1;

                for (const project of entity.projects.edges.map(e => e.node)) {
                    this.totals.projects++;

                    project.latestScan.scanAssets.edges = project.latestScan.scanAssets.edges.filter((asset, index, self) => {
                        return asset.node.embeddedAssets.edges.length > 0;
                    });

                    for (const asset of project.latestScan.scanAssets.edges) {
                        if (maxAssetSize < asset.node.assetSize) {
                            maxAssetSize = asset.node.assetSize;
                        }
                    }

                    this.totals.embedded += project.latestScan.scanAssets.edges.length;
                }
            }

            if (maxAssetSize > 0 && this.sizeFilterRef !== undefined) {
                let label = 'B';
                if (maxAssetSize >= 1024) {

                    maxAssetSize = Math.round(maxAssetSize / 1024);
                    label = 'KB';
                }

                this.sizeFilterConfig.pips.format.label = label;
                this.sizeFilterConfig.range.max = maxAssetSize;
                this.sizeFilter = [0, maxAssetSize];
                this.sizeFilterRef.slider.updateOptions({
                    range: {
                        min: 0,
                        max: 15
                    }
                });
            }
        }, error => {
            console.error("EmbeddedAssetReportComponent", error);
        });
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
        if (!this.displayDataOnly && event.keyCode === 27) {
            this.closePreview();
            event.stopPropagation();
            event.preventDefault();
        }
    }

}
