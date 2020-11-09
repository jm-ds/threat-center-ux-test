import {Component, OnInit} from '@angular/core';
import {Messages, PolicyConnection} from "@app/models";
import {Router} from "@angular/router";
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

    constructor(
        private policyService: PolicyService,
        protected router: Router,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.onlyActive = true;
        this.fetchList();
    }

    fetchList() {
        this.policyService.getPolicyList(this.onlyActive).subscribe(
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