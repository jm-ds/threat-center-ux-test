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
    activeTabIdString: string = "policyGeneralInfo";


    public actionCols = ['ActionType','ActionName'];
    public actionTypes = [{label: 'Alert', value: 'ALERT'},{label: 'Issue', value: 'ISSUE'},{label: 'Gate Release', value: 'RELEASE'},
       {label: 'Attribute Source', value: 'ATTRIBUTION'}, {label: 'Upgrade library version', value: 'UPGRADE_VERSION'}];
    public actionNames = {
        'ALERT': [{label: 'Slack', value: 'SLACK'},{label: 'E-mail', value: 'EMAIL'},{label: 'Dashboard', value:'DASHBOARD'}],
        'ISSUE' : [{label: 'Jira', value: 'JIRA'},{label: 'Github', value:'GITHUB'}],
        'RELEASE': [{label: 'No', value:'NO'},{label: 'Release', value:'PROD'}],
        'ATTRIBUTION': [{label: 'Attribute Source', value:'ATTRIBUTION'}],
        'UPGRADE_VERSION': [{label: 'Latest Secured Version', value:'LAST_VERSION'},{label: 'Next Secured Version', value:'NEXT_VERSION'}]
    };
    public actionTypeMap={};
    public actionNameMap={};



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
                    this.prepareConditionsAfterFetch(data.data.policy.conditions, this.policy);
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
        this.fillActionMaps();
    }

    fillActionMaps() {
        this.actionTypes.forEach(obj => {
            this.actionTypeMap[obj.value] = obj.label;
        });
        for (const tp in this.actionNames) {
            this.actionNameMap[tp] = {};
            this.actionNames[tp].forEach(obj => {
                this.actionNameMap[tp][obj.value] = obj.label;
            });
    
        }
    }

    prepareConditionsAfterFetch(group: PolicyConditionGroup, policy: Policy) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = !!condition.strValue ? condition.strValue.split(","): [];
                }
            }
            if (group.groups && group.groups.length>0) {
                for (const condition of group.groups[0].conditions) {
                    condition.conditionType = policy.conditionType;
                }
    
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.prepareConditionsAfterFetch(grp, policy);
            }
        }
    }


    removePolicy() {
        if (confirm("Are you sure you want to delete the policy?")) {
            this.preparePolicyBeforeSend(this.policy.conditions);
            this.policyService.removePolicy(this.policy)
                .subscribe(({data}) => {
                    const link = '/dashboard/policy/list'+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                    this.router.navigate([link],
                        {state: {messages: [Message.success("Policy removed successfully.")]}});
                }, (error) => {
                    const link = '/dashboard/policy/show/'+ this.policy.policyId+
                        ((!!this.entityId)? ('/'+this.entityId):'')+
                        ((!!this.projectId)? ('/'+this.projectId):'');
                let msg = '';
                if (error.message) {
                    const msgs = error.message.split(":");
                    if (msgs.length>0) {
                        msg = msgs[msgs.length-1];
                    }
                }
                this.router.navigate([link],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to remove policy. "+msg)]}});
                });
        }
    }

    preparePolicyBeforeSend(group: PolicyConditionGroup) {
        if (!group) {
            return;
        }
        if (group.conditions) {
            for (const condition of group.conditions) {
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = undefined;
                }
            }
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.preparePolicyBeforeSend(grp);
            }
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
            this.preparePolicyBeforeSend(this.policy.conditions);
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
                    let msg = '';
                    if (error.message) {
                        const msgs = error.message.split(":");
                        if (msgs.length>0) {
                            msg = msgs[msgs.length-1];
                        }
                    }
                    this.router.navigate([link],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to change policy state. "+msg)]}});
                });
        }
    }

    gotoTab(tabId: string) {
        this.activeTabIdString = tabId;
    }
}
