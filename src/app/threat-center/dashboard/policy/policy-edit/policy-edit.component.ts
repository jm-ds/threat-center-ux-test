import {Component, OnInit} from '@angular/core';
import {Message, Messages, Policy, PolicyAction, PolicyCondition, PolicyConditionGroup} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "@app/threat-center/dashboard/services/policy.service";

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
            this.policy.rootGroup=new PolicyConditionGroup();
            this.policy.rootGroup.groupOperator = "AND";
            this.confirmed = [];
        }
    }

    savePolicy() {
        let messages: Message[] = this.validatePolicy();
        if (messages.length>0) {
            this.messages = messages;
            return;
        }
        this.prepareConditionsBeforeSave(this.policy.rootGroup);
        this.policyService.savePolicy(this.policy)
            .subscribe(data => {
                this.router.navigate(['/dashboard/policy/show/' + data.data.createPolicy.policyId],
                    {state: {messages: [Message.success("Policy saved successfully.")]}});
            }, (error) => {
                console.error('Policy Saving', error);
                this.messages = 
                    [Message.error("Unexpected error occurred while trying to save policy.")];
            });
    }


    // validation policy
    validatePolicy(): Message[] {
        let resMessages: Message[] = [];
        if (!this.policy.name) {
            resMessages.push(Message.error("Policy name field is required."));
        }
        if (!this.policy.title) {
            resMessages.push(Message.error("Policy title field is required."));
        }
        resMessages = resMessages.concat(this.validateConditionsExists(this.policy.rootGroup));
        resMessages = resMessages.concat(this.validateConditions(this.policy.rootGroup));
        if (!this.policy.actions || this.policy.actions.length === 0) {
            resMessages.push(Message.error("Policy actions must be filled."));
        }
        return resMessages;
    }

    validateConditionsExists(group: PolicyConditionGroup): Message[] {
        if ((!group.conditions || group.conditions.length===0) && 
            (!group.groups || group.groups.length===0)) {
            return [Message.error("Condition group must contain conditions or nested groups.")];
        }
        if (group.groups && group.groups.length>0) {
            for (const grp of group.groups) {
                let childMessages: Message[] = this.validateConditionsExists(grp);
                if (childMessages.length>0) {
                    return childMessages;
                }
            }
        }
        return [];
    }

    validateConditions(group: PolicyConditionGroup): Message[] {
        let resMessages: Message[] = [];
        if (group.conditions && group.conditions.length>0)  {
            for (const condition of group.conditions) {
                if (condition.conditionType === "SECURITY") {
                    resMessages = resMessages.concat(this.validateSecurityCondition(condition));
                } else if (condition.conditionType === "LEGAL") {
                    resMessages = resMessages.concat(this.validateLegalCondition(condition));
                } else if (condition.conditionType === "COMPONENT") {
                    resMessages = resMessages.concat(this.validateComponentCondition(condition));
                } else if (condition.conditionType === "CODE_QUALITY") {
                    resMessages = resMessages.concat(this.validateCodeQualityCondition(condition));
                } else if (condition.conditionType === "WORKFLOW")   {
                    resMessages = resMessages.concat(this.validateWorkflowCondition(condition));
                }
            }
        }
        if (group.groups && group.groups.length>0) {
            for (const grp of group.groups) {
                resMessages = resMessages.concat(this.validateConditions(grp));
            }
        }    
        return resMessages;
    }

    validateSecurityCondition(condition: PolicyCondition): Message[] {
        let resMessages: Message[] = [];
        if (condition.securityCVSS3ScoreOperator && !condition.securityCVSS3ScoreValue) {
            resMessages.push(Message.error("Security condition. CVSS3 Score must be specified if operator is specified"));
        }
        if (!condition.securityCVSS3ScoreOperator && condition.securityCVSS3ScoreValue) {
            resMessages.push(Message.error("Security condition. CVSS3 Score operator must be specified if value is specified"));
        }
        if (condition.securitySeverityOperator && !condition.securitySeverityValue) {
            resMessages.push(Message.error("Security condition. Severity must be specified if operator is specified"));
        }
        if (!condition.securitySeverityOperator && condition.securitySeverityValue) {
            resMessages.push(Message.error("Security condition. Severity operator must be specified if value is specified"));
        }
        if (!condition.securitySeverityOperator && !condition.securityCVSS3ScoreOperator) {
            resMessages.push(Message.error("Security condition. Severity or CVSS3 Score must be specified"));
        }
        return resMessages;
    }

    validateLegalCondition(condition: PolicyCondition): Message[] {
        let resMessages: Message[] = [];
        if (condition.legalLicenseFamilyOperator && !condition.legalLicenseFamilyValue) {
            resMessages.push(Message.error("Legal condition. License family must be specified if operator is specified"));
        }
        if (!condition.legalLicenseFamilyOperator && condition.legalLicenseFamilyValue) {
            resMessages.push(Message.error("Legal condition. License family operator must be specified if value is specified"));
        }
        if (condition.legalLicenseNameOperator && !condition.legalLicenseNameValue) {
            resMessages.push(Message.error("Legal condition. License name must be specified if operator is specified"));
        }
        if (!condition.legalLicenseNameOperator && condition.legalLicenseNameValue) {
            resMessages.push(Message.error("Legal condition. License name operator must be specified if value is specified"));
        }
        if (condition.legalLicenseTypeOperator && !condition.legalLicenseTypeValue) {
            resMessages.push(Message.error("Legal condition. License type must be specified if operator is specified"));
        }
        if (!condition.legalLicenseTypeOperator && condition.legalLicenseTypeValue) {
            resMessages.push(Message.error("Legal condition. License type operator must be specified if value is specified"));
        }
        if (!condition.legalLicenseFamilyOperator && !condition.legalLicenseNameOperator && !condition.legalLicenseTypeOperator) {
            resMessages.push(Message.error("Legal condition. License family or type or name must be specified"));
        }
        return resMessages;
    }

    validateComponentCondition(condition: PolicyCondition): Message[] {
        let resMessages: Message[] = [];
        if (condition.componentLibraryAgeOperator && !condition.componentLibraryAgeValue) {
            resMessages.push(Message.error("Component condition. Library age must be specified if operator is specified"));
        }
        if (!condition.componentLibraryAgeOperator && condition.componentLibraryAgeValue) {
            resMessages.push(Message.error("Component condition. Library age operator must be specified if value is specified"));
        }
        if (condition.componentVersBehindOperator && !condition.componentVersBehindValue) {
            resMessages.push(Message.error("Component condition. Versions Behind must be specified if operator is specified"));
        }
        if (!condition.componentVersBehindOperator && condition.componentVersBehindValue) {
            resMessages.push(Message.error("Component condition. Versions Behind operator must be specified if value is specified"));
        }
        if (!condition.componentLibraryAgeOperator && !condition.componentVersBehindOperator && 
            !condition.componentGroupId && !condition.componentArtifactId && !condition.componentVersion) {
            resMessages.push(Message.error("Component condition. Library age or Versions behind or GAV must be specified"));
        }
        return resMessages;
    }

    validateCodeQualityCondition(condition: PolicyCondition): Message[] {
        let resMessages: Message[] = [];
        if (condition.codeQualityEmbAssetsOperator && !condition.codeQualityEmbAssetsValue) {
            resMessages.push(Message.error("Code quality condition. Embedded assets percentage must be specified if operator is specified"));
        }
        if (!condition.codeQualityEmbAssetsOperator && condition.codeQualityEmbAssetsValue) {
            resMessages.push(Message.error("Code quality condition. Embedded assets percentage operator must be specified if value is specified"));
        }
        if (!condition.codeQualityEmbAssetsOperator) {
            resMessages.push(Message.error("Code quality condition. Embedded assets percentage must be specified"));
        }
        return resMessages;
    }

    validateWorkflowCondition(condition: PolicyCondition): Message[] {
        let resMessages: Message[] = [];
        if (!condition.workflowReleasePhase) {
            resMessages.push(Message.error("Workflow condition. Release Phase must be specified if operator is specified"));
        }
        return resMessages;
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
