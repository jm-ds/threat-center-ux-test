import {Component, Injectable, Input, OnInit} from '@angular/core';
import { Policy, PolicyCondition, PolicyConditionGroup } from '@app/models';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'condition-builder',
    templateUrl: './condition-builder.component.html',
    styleUrls: ['./condition-builder.component.scss']
})
export class ConditionBuilderComponent implements OnInit {
    @Input() public group: PolicyConditionGroup;
    @Input() public parentGroup: PolicyConditionGroup;
    @Input() public policy: Policy;
    @Input() public readonly: Boolean;

    securityOperators: CodeNamePair[];
    securitySeverityValues: CodeNamePair[];
    securityCVSS3ScoreValues: CodeNamePair[]
    legalOperators: CodeNamePair[];
    legalFoundInValues: CodeNamePair[];
    componentOperators: CodeNamePair[];
    codeQualityOperators: CodeNamePair[];
    workflowReleasePhases: CodeNamePair[];

    conditionTypeItems: CodeNamePair[];

    conditionTypes: object;

    constructor(group: PolicyConditionGroup, parentGroup: PolicyConditionGroup, policy: Policy){
        this.group = group;
        this.parentGroup = parentGroup;
        this.policy = policy;
    }


    ngOnInit() {
        this.securityOperators = [
            { code: "EQ", name: "=" },
            { code: "GT", name: ">" },
            { code: "LT", name: "<" }
        ];
        this.legalOperators = [
            { code: "EQ", name: "=" },
            { code: "LIKE", name: "LIKE" }
        ];
        this.componentOperators = [
            { code: "EQ", name: "=" },
            { code: "GT", name: ">" },
            { code: "LT", name: "<" }
        ];
        this.codeQualityOperators = [
            { code: "GT", name: ">" },
            { code: "LT", name: "<" }
        ];
        this.workflowReleasePhases = [
            { code: "DEVELOPMENT", name: "Development" },
            { code: "STAGE", name: "Stage" },
            { code: "Q/A", name: "Q/A" },
            { code: "PRODUCTION", name: "Production" }
        ];
        this.securitySeverityValues = [
            { code: "INFO", name: "Info" },
            { code: "MEDIUM", name: "Medium" },
            { code: "HIGH", name: "High" },
            { code: "CRITICAL", name: "Critical" }
        ];
        this.securityCVSS3ScoreValues = [
            { code: "1", name: "1" },
            { code: "2", name: "2" },
            { code: "3", name: "3" },
            { code: "4", name: "4" },
            { code: "5", name: "5" },
            { code: "6", name: "6" },
            { code: "7", name: "7" },
            { code: "8", name: "8" },
            { code: "9", name: "9" },
            { code: "10", name: "10" }
        ];
        this.legalFoundInValues = [
            { code: "COMPONENT", name: "Component" },
            { code: "IP", name: "IP" }
        ];
        this.conditionTypes = {
            "SECURITY": "Security",
            "LEGAL": "Legal",
            "COMPONENT": "Component" ,
            "CODE_QUALITY": "Code quality",
            "WORKFLOW": "Workflow"
        };
        this.conditionTypeItems = [];
        for (const key in this.conditionTypes) {
            if (Object.prototype.hasOwnProperty.call(this.conditionTypes, key)) {
                this.conditionTypeItems.push({code: key, name: this.conditionTypes[key]})
            }
        }
    }

    removeGroup(group: PolicyConditionGroup) {
        if (this.parentGroup.groupOperator) {
            const index = this.parentGroup.groups.indexOf(group);
            if (index > -1) {
                this.parentGroup.groups.splice(index, 1);
            }
        }
    }

    removeCondition(condition: PolicyCondition) {
        const index = this.group.conditions.indexOf(condition);
        if (index > -1) {
        this.group.conditions.splice(index, 1);
        }
    }

    addChildGroup() {
        if (this.group.groupOperator) {
        let newGroup = new PolicyConditionGroup();
        newGroup.groupOperator="OR";
        if (!this.group.groups) {
            this.group.groups=[];
        }
        this.group.groups.push(newGroup);
        }
    }

    addCondition() {
        if (this.group.groupOperator) {
        let newCondition = new PolicyCondition();
        newCondition.conditionType=this.policy.conditionType;
        if (!this.group.conditions) {
            this.group.conditions=[];
        }
        this.group.conditions.push(newCondition);
        }
    }

    setConditionType(conditionType: string) {
        console.log("new condition type "+conditionType);
        this.setGroupConditionType(this.group, conditionType);
    }

    setGroupConditionType(group: PolicyConditionGroup, conditionType: string) {
        if (group.conditions) {
            group.conditions = group.conditions.filter(item => item.conditionType === conditionType);
        }
        if (group.groups) {
            for (const grp of group.groups) {
                this.setGroupConditionType(grp,conditionType);
            }
            group.groups = group.groups.filter(item => item.conditions.length>0);
        }
    }
}

class CodeNamePair {
  code: String;
  name: String;
}
