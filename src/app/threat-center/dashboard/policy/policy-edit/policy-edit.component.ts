import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message, Messages, Policy, PolicyAction, PolicyCondition, PolicyConditionGroup} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";
import { ApiService } from '@app/threat-center/shared/services/api.service';
import { ConditionBuilderComponent } from '../condition-builder/condition-builder.component';

@Component({
  selector: 'app-policy-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.scss'],
  providers: [PolicyConditionGroup, Policy]
})
export class PolicyEditComponent implements OnInit {

    policy: Policy;
    newPolicy = true;
    messages: Messages;
    confirmed: Array<any>;
    source: Array<any>;
    display: any;
    entityId: string;
    projectId: string
    conditionTypeItems: any;
    conditionType: CodeNamePair;
    @ViewChild(ConditionBuilderComponent, {static: false}) conditions: ConditionBuilderComponent;
    activeTabIdString: string = "policyGeneralInfo";


    public actionTypes = [{label: 'ALERT', value: 'ALERT'},{label: 'ISSUE', value: 'ISSUE'},{label: 'RELEASE', value: 'RELEASE'}];
    public actionNames = {
        'ALERT': [{label: 'SLACK', value: 'SLACK'},{label: 'EMAIL', value: 'EMAIL'},{label: 'DASHBOARD', value:'DASHBOARD'}],
        'ISSUE' : [{label: 'JIRA', value: 'JIRA'},{label: 'GITHUB', value:'GITHUB'}],
        'RELEASE': [{label: 'NO', value:'NO'},{label: 'DEV', value:'DEV'},{label: 'STAGE', value:'STAGE'},{label: 'PROD', value:'PROD'}]
    };


    public actionCols = ['ActionType','ActionName'];


    constructor(
        private policyService: PolicyService,
        private apiService: ApiService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.policy = null;
        this.conditionTypeItems = this.policyService.getConditionTypeItems();
        const policyId = this.route.snapshot.paramMap.get('policyId');
        this.entityId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('entityId'));
        this.projectId = this.policyService.nullUUID(this.route.snapshot.paramMap.get('projectId'));
        if (policyId !== null && policyId !== undefined) {
            this.newPolicy = false;
            this.policyService.getPolicy(this.entityId, this.projectId, policyId).subscribe(
                data => {
                    this.policy = data.data.policy;
                    if (this.policy) {
                        this.prepareConditionsAfterFetch(data.data.policy.conditions);
                    } else {
                        this.policy = undefined;
                        console.error("PolicyEditComponent", "Policy not found");
                    }
                    this.conditionType = { "code": this.policy.conditionType, "name": this.policyService.getConditionTypes()[this.policy.conditionType]};
                },
                error => {
                    this.policy = undefined;
                    console.error("PolicyEditComponent", error);
                }
            );
        } else {
            this.newPolicy = true;
            this.policy = new Policy();
            this.createRootGroup();
            this.policy.actions=[];
            this.policy.conditionType = "SECURITY";
            this.policy.entityId=this.entityId;
            this.policy.projectId=this.projectId;
            this.policy.applyToChilds = true;
            this.confirmed = [];
            if (!!this.entityId) {
                this.apiService.getEntity(this.entityId).subscribe(data=>{
                    this.policy.entity=data.data.entity;
                })
            }
            if (!!this.projectId) {
                this.apiService.getProject(this.projectId, 1).subscribe(data=>{
                    this.policy.project=data.data.project;
                })
            }
            this.conditionType = { "code": this.policy.conditionType, "name": this.policyService.getConditionTypes()[this.policy.conditionType]};
        }
    }

    createRootGroup() {
        this.policy.conditions=new PolicyConditionGroup();
        this.policy.conditions.groupOperator = "AND";
        let mainGroup = new PolicyConditionGroup();
        mainGroup.groupOperator = "AND";
        let subordinateGroup = new PolicyConditionGroup();
        subordinateGroup.groupOperator = "OR";
        this.policy.conditions.groups.push(mainGroup);
        this.policy.conditions.groups.push(subordinateGroup);
    }    

    savePolicy() {
        let messages: Message[] = this.validatePolicy();
        if (messages.length>0) {
            this.messages = messages;
            return;
        }
        this.prepareConditionsBeforeSave(this.policy.conditions);
        this.policyService.savePolicy(this.policy)
            .subscribe(data => {
                const link = '/dashboard/policy/show/'+ data.data.createPolicy.policyId+
                    ((!!this.entityId)? ('/'+this.entityId):'')+
                    ((!!this.projectId)? ('/'+this.projectId):'');
                this.router.navigate([link],
                    {state: {messages: [Message.success("Policy saved successfully.")]}});
            }, (error) => {
                let msg = '';
                if (error.message) {
                    const msgs = error.message.split(":");
                    if (msgs.length>0) {
                        msg = msgs[msgs.length-1];
                    }
                }
                this.messages = 
                    [Message.error("Unexpected error occurred while trying to save policy. "+msg)];
            });
    }


    // validation policy
    validatePolicy(): Message[] {
        let resMessages: Message[] = [];
        if (!this.policy.name) {
            resMessages.push(Message.error("Policy name field is required."));
        }
        /*if (!this.policy.title) {
            resMessages.push(Message.error("Policy title field is required."));
        }*/
        resMessages = resMessages.concat(this.validateConditionsExists());
        if (!this.policy.actions || this.policy.actions.length === 0) {
            resMessages.push(Message.error("Policy actions must be filled."));
        }
        return resMessages;
    }

    // validate conditions
    validateConditionsExists(): Message[] {
        if (this.policy.conditions.groups[0].conditions && this.policy.conditions.groups[0].conditions.length === 0) {
            return [Message.error("Main condition group must contain conditions.")];
        }
        let typeNotExists = false;
        let operatorNotExists = false;
        let valueNotExists = false;
        let conditions: PolicyCondition[] = [];
        conditions = this.policy.conditions.groups[0].conditions;
        if (!!this.policy.conditions.groups[1] && !!this.policy.conditions.groups[1].conditions && this.policy.conditions.groups[1].conditions.length>0) {
            conditions = conditions.concat(this.policy.conditions.groups[1].conditions);
        }
        for (const cond of conditions) {
            if (!cond.conditionType) {
                typeNotExists = true;
            }
            if (!cond.operator) {
                operatorNotExists = true;
            }
            let value= undefined;
            if (cond.conditionDataType === "DCM") {
                value = cond.decimalValue;
            } else if (cond.conditionDataType === "DBL") {
                value = cond.doubleValue;
            } else if (cond.conditionDataType === "INT") {
                value = cond.intValue;
            } else if (cond.conditionDataType === "SVR") {
                value = cond.severityValue;
            } else  {
                value = cond.strValue;
            }    
            if (!value) {
                valueNotExists = true;
            }
        }
        let result: Message[] = [];
        if (typeNotExists) {
            result.push(Message.error("Condition type must be filled."))
        }
        if (operatorNotExists) {
            result.push(Message.error("Condition operator must be filled."))
        }
        if (valueNotExists) {
            result.push(Message.error("Condition value must be filled."))
        }
        return result;
    }

    prepareConditionsBeforeSave(group: PolicyConditionGroup) {
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
                if (condition.conditionType==='RELEASE_STAGE') {
                    condition.arrayValue = !!condition.strValue ? condition.strValue.split(","): [];
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

    onTypeChange(event: any) {
        if (this.policy.conditions) {
            if (this.policy.conditions.groups && this.policy.conditions.groups.length>0) {
                const conditionType = this.getConditionTypeFromGroup(this.policy.conditions.groups[0]);
                if (conditionType && conditionType!=event) {
                    let mainGroup = new PolicyConditionGroup();
                    mainGroup.groupOperator = "AND";
                    this.policy.conditions.groups[0] = mainGroup;
                }
            }
        }
    }

    getConditionTypeFromGroup(group: PolicyConditionGroup) {
        if (group.conditions && group.conditions.length>0) {
            return group.conditions[0].conditionType;
        }
        if (group.groups && group.groups.length>0) {
            group.groups.forEach(grp => {
                let conditionType = this.getConditionTypeFromGroup(grp);
                if (conditionType) {
                    return conditionType;
                }
            });
        }
        return undefined;
    }

    gotoTab(tabId: string) {
        this.activeTabIdString = tabId;
    }
    

}

class CodeNamePair {
    code: string;
    name: string;
  }
  
