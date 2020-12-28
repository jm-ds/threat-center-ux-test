import {Component, OnInit} from '@angular/core';
import {Message, Messages, Policy, PolicyConditionGroup} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";

@Component({
    selector: 'app-policy-view',
    templateUrl: './policy-show.component.html',
    styleUrls: ['./policy-show.component.scss'],
    providers: [PolicyConditionGroup, Policy]
})
export class PolicyShowComponent implements OnInit {

    policy: Policy;
    messages: Messages;
    entityId: string;
    projectId: string
    conditionTypes: any;


    public actionCols = ['ActionType','ActionName'];


    constructor(
        private policyService: PolicyService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.policy = null;
        this.conditionTypes = this.policyService.getConditionTypes();
        const policyId = this.route.snapshot.paramMap.get('policyId');
        this.entityId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('entityId'));
        this.projectId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('projectId'));
        this.policyService.getPolicy(this.entityId, this.projectId, policyId).subscribe(
            data => {
                this.policy = data.data.policy;
                if (this.policy) {
                    this.prepareConditionsAfterFetch(data.data.policy.rootGroup);
                } else {
                    this.policy = undefined;
                    console.error("PolicyShowComponent", "Policy not found");
                }
            },
            error => {
                this.policy = undefined;
                console.error("PolicyShowComponent", error);
            }
        );
    }

    prepareConditionsAfterFetch(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='WORKFLOW') {
                    if (condition.workflowReleasePhase && !(condition.workflowReleasePhase instanceof Array)) {
                        condition.workflowReleasePhase=condition.workflowReleasePhase.split(",");
                    }
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsAfterFetch(grp);
            }
        }
    }


    removePolicy() {
        if (confirm("Are you sure you want to delete the policy?")) {
            this.policyService.removePolicy(this.policy)
                .subscribe(({data}) => {
                    const link = '/dashboard/policy/list'+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                    this.router.navigate([link],
                        {state: {messages: [Message.success("Policy removed successfully.")]}});
                }, (error) => {
                    console.error('Policy Removing', error);
                    const link = '/dashboard/policy/show/'+ this.policy.policyId+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                    this.router.navigate([link],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to remove policy.")]}});
                });
        }
    }

    // enable/disable policy
    enablePolicy() {
        let confirmText = "Are you sure you want to disable the policy?";
        if (!this.policy.active) {
            confirmText = "Are you sure you want to enable the policy?";
        }
        if (confirm(confirmText)) {
            let policy = Object.assign({}, this.policy);
            policy.active=!policy.active;
            this.policyService.enablePolicy(policy)
                .subscribe(({data}) => {
                    const link = '/dashboard/policy/list'+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                    this.router.navigate([link],
                        {state: {messages: [Message.success("Policy state changed successfully.")]}});
                }, (error) => {
                    console.error('Policy state change', error);
                    const link = '/dashboard/policy/show/'+ this.policy.policyId+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                    this.router.navigate([link],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to change policy state.")]}});
                });
        }
    }

}
