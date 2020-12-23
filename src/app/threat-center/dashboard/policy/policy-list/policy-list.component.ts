import {Component, OnInit} from '@angular/core';
import {Messages, PolicyConnection} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";

@Component({
    selector: 'app-policy-list',
    templateUrl: './policy-list.component.html',
    styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

    policies: PolicyConnection;
    messages: Messages;
    onlyActive: Boolean;
    entityId: string;
    projectId: string;
    conditionTypes: any;

    constructor(
        private policyService: PolicyService,
        protected router: Router,
        private route: ActivatedRoute
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.onlyActive = true;
        this.entityId = this.route.snapshot.paramMap.get('entityId');
        this.projectId = this.route.snapshot.paramMap.get('projectId');
        this.conditionTypes = this.policyService.getConditionTypes();
        this.fetchList();
    }

    fetchList() {
        this.policyService.getPolicyList(this.entityId, this.projectId, this.onlyActive).subscribe(
            data => {
                this.policies = data.data.policies;
            },
            error => {
                console.error("PolicyListComponent", error);
            }
        );
    }

    onlyActiveChange() {
        if (this.onlyActive) {
            this.onlyActive = undefined;
        } else {
            this.onlyActive = true;    
        }
        this.fetchList();
    }

}