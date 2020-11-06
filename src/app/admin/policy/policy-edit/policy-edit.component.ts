import {Component, OnInit} from '@angular/core';
import {Message, Messages, Policy, PolicyAction, PolicyConditionGroup} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/admin/services/policy.service";

@Component({
  selector: 'app-policy-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.scss'],
  providers: [PolicyConditionGroup]
})
export class PolicyEditComponent implements OnInit {

    policy: Policy;
    newPolicy = true;
    messages: Messages;
    confirmed: Array<any>;
    source: Array<any>;
    display: any;
    public actionTypes = [{label: 'ALERT', value: 'ALERT'},{label: 'ISSUE', value: 'ISSUE'},{label: 'RELEASE', value: 'RELEASE'}];
    public actionNames = {
        'ALERT': [{label: 'SLACK', value: 'SLACK'},{label: 'EMAIL', value: 'EMAIL'},{label: 'DASHBOARD', value:'DASHBOARD'}],
        'ISSUE' : [{label: 'JIRA', value: 'JIRA'},{label: 'GITHUB', value:'GITHUB'}],
        'RELEASE': [{label: 'NO', value:'NO'},{label: 'DEV', value:'DEV'},{label: 'STAGE', value:'STAGE'},{label: 'PROD', value:'PROD'}]
    };


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
        if (policyId !== null && policyId !== undefined) {
            this.newPolicy = false;
            this.policyService.getPolicy(policyId).subscribe(
                data => {
                    this.prepareConditionsAfterFetch(data.data.policy.rootGroup);
                    this.policy = data.data.policy;
                },
                error => {
                    console.error("PolicyShowComponent", error);
                }
            );
        } else {
            this.newPolicy = true;
            this.policy = new Policy();
            this.policy.rootGroup=new PolicyConditionGroup()
            this.policy.rootGroup.groupOperator = "AND";
            this.confirmed = [];
        }
    }

    savePolicy() {
        this.prepareConditionsBeforeSave(this.policy.rootGroup);
        this.policyService.savePolicy(this.policy)
            .subscribe(data => {
                this.router.navigate(['/admin/policy/show/' + data.data.createPolicy.policyId],
                    {state: {messages: [Message.success("Policy saved successfully.")]}});
            }, (error) => {
                console.error('Policy Saving', error);
                /*this.router.navigate([this.newPolicy ? '/admin/policy/list' : '/admin/policy/show/' + this.policy.policyId],
                    {state: {messages: [Message.error("Unexpected error occurred while trying to save policy.")]}});*/
            });
    }

    prepareConditionsBeforeSave(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='WORKFLOW') {
                    if (condition.workflowReleasePhase && condition.workflowReleasePhase instanceof Array) {
                        condition.workflowReleasePhase=condition.workflowReleasePhase.join(",");
                    }
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsBeforeSave(grp);
            }
        }
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

    addAction() {
        if (!this.policy.actions) {
            this.policy.actions = [];
        }
        const action = new PolicyAction();
        // give default values
        action.actionType='ALERT';
        action.actionName='EMAIL';
        this.policy.actions.push(action)
    }

    onActionTypeChange(action: PolicyAction, event: any) {
        if (!action.actionType) {
            action.actionName=undefined;    
        } else {
            action.actionName=this.actionNames[action.actionType][0].value;
        }
    }

    removeAction(action: PolicyAction) {
        if (!this.policy.actions) {
            return;
        }
        const index = this.policy.actions.indexOf(action);
        if (index > -1) {
            this.policy.actions.splice(index, 1);
        }
    }

}
