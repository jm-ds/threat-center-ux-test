import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { AuthorizationService } from "@app/security/services";
import { Project } from "@app/threat-center/shared/models/types";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

@Component({
    selector: 'project-dashboard-header',
    templateUrl: './dashboard-header.component.html',
    styleUrls: ['./dashboard-header.component.scss']
})

export class ProjectDashboardHeaderComponent implements OnInit, OnDestroy {

    @Input() obsProject: Observable<Project>;
    @Output() openProjectTag: EventEmitter<any> = new EventEmitter();
    constructor(protected authorizationService: AuthorizationService, private modalService: NgbModal) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }

    // open project tags popup
    openProjectTagDialog(content: any) {
        this.openProjectTag.emit();
    }


}