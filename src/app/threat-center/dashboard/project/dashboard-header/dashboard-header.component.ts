import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AuthorizationService } from "@app/security/services";
import { Project } from "@app/threat-center/shared/models/types";
import { Observable } from "rxjs";

@Component({
    selector: 'project-dashboard-header',
    templateUrl: './dashboard-header.component.html',
    styleUrls: ['./dashboard-header.component.scss']
})

export class ProjectDashboardHeaderComponent implements OnInit, OnDestroy {

    @Input() obsProject: Observable<Project>;
    constructor(protected authorizationService: AuthorizationService) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }

}