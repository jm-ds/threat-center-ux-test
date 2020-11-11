import {Component, OnInit} from '@angular/core';
import {Message, Messages, Policy, PolicyConditionGroup} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";

@Component({
    selector: 'app-policy-view',
    templateUrl: './policy-show.component.html',
    styleUrls: ['./policy-show.component.scss'],
    providers: [PolicyConditionGroup]
})
export class PolicyShowComponent implements OnInit {

    policy: Policy;
    messages: Messages;

    public actionCols = ['ActionType','ActionName'];


    constructor(
        private policyService: PolicyService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        const policyId = this.route.snapshot.paramMap.get('policyId');
        this.policyService.getPolicy(policyId).subscribe(
            data => {
                this.prepareConditionsAfterFetch(data.data.policy.rootGroup);
                this.policy = data.data.policy;
            },
            error => {
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
        if (confirm("Are you sure you want to delete the policy ?")) {
            this.policyService.removePolicy(this.policy)
                .subscribe(({data}) => {
                    this.router.navigate(['/dashboard/policy/list'],
                        {state: {messages: [Message.success("Policy removed successfully.")]}});
                }, (error) => {
                    console.error('Policy Removing', error);
                    this.router.navigate(['/dashboard/policy/show/' + this.policy.policyId],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to remove policy.")]}});
                });
        }
    }

}
