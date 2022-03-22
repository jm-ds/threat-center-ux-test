import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {AuthorizationService} from "@app/security/services";
import {Project} from "@app/threat-center/shared/models/types";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs";
import {ScanService} from "@app/services/scan.service";
import {IgnoredFiles, Level, Type} from "@app/models/ignored-files";

@Component({
    selector: 'project-dashboard-header',
    templateUrl: './dashboard-header.component.html',
    styleUrls: ['./dashboard-header.component.scss']
})

export class ProjectDashboardHeaderComponent implements OnInit, OnDestroy {

    @Input() obsProject: Observable<Project>;
    @Output() openProjectTag: EventEmitter<any> = new EventEmitter();
    constructor(protected authorizationService: AuthorizationService, private modalService: NgbModal, private scanService: ScanService) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }

    // open project tags popup
    openProjectTagDialog(content: any) {
        console.warn('send ignore files request');

        let abc = new IgnoredFiles();
        abc.objectId = "33874be4-d8f8-4267-8e03-631c39777774";
        abc.level = Level.PROJECT;
        abc.type = Type.FILES;
        abc.pattern = "my.file";

        //save
        this.scanService.saveIgnoredFiles(abc).subscribe(data => {
            console.warn("response is ", data);
        }, error => {
            console.error("UserEditComponent", error);
        });

        //read
        this.scanService.getIgnoredFiles('33874be4-d8f8-4267-8e03-631c39777774', 'f1f74bfd-23a2-4914-9ba6-f2e697e5d97b').subscribe(data => {
            console.warn("response is ", data);
        }, error => {
            console.error("UserEditComponent", error);
        });

        //remove
        this.scanService.removeIgnoredFiles(abc).subscribe(data => {
            console.warn("response is ", data);
        }, error => {
            console.error("UserEditComponent", error);
        });
    }
}