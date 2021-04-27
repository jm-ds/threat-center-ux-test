import { Injectable } from '@angular/core';
import { PageInfo } from './common';
import { Entity } from './entity';
import { Project } from './project';

@Injectable()
export class Policy {
    readonly orgId: string;
    readonly policyId: string;
    entityId: string;
    projectId: string;
    name: string;
    title: string;
    description: string;
    createdBy: string;
    active: boolean;
    applyToChilds: boolean;
    entity: Entity;
    project: Project;
    createDate: Date;
    dateLastStateChange: Date;
    conditionType: string;
    overridePolicyId: string;
    overridePolicyTitle: string;
    stateChangedBy: string;
    conditions: PolicyConditionGroup;
    rootGroup: PolicyConditionGroup;
    actions: PolicyAction[];
}

@Injectable()
export class PolicyConditionGroup {
    groupOperator: string;
    groups: PolicyConditionGroup[];
    conditions: PolicyCondition[];
    constructor() {
        this.groups=[];
        this.conditions=[];
    }
}

export class PolicyCondition {
    conditionType: string;
    conditionName: string;
    operator: string;

    conditionDataType: string;
    strValue: string;
    intValue: number;
    doubleValue: number;
    decimalValue: number;
    severityValue: string;
    arrayValue: string[];

    threshold: number;

    logicalOperator: string;
}

export class PolicyAction {
    readonly orgId: string;
    readonly policyId: string;
    actionType: string;
    actionName: string;
}

export class PolicyConnection {
    edges: PolicyEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}

export class PolicyEdge {
    node: Policy;
    cursor: string;
}

export interface PoliciesQuery {
    policies: PolicyConnection;
}

export interface PolicyQuery {
    policy: Policy;
}

export class PolicyRequestInput {
    readonly policy: Policy;
    constructor(policy: Policy) {
        delete policy['entity'];
        delete policy['project'];
        delete policy["__typename"];
        let gr=[policy.conditions];
        while (gr.length>0 && gr[0]) {
            let group = gr.shift();
            delete group["__typename"];
            if (group.conditions) {
                group.conditions.forEach(element => {
                    delete element["__typename"];
                });
            }
            if (group.groups) {
                group.groups.forEach(element=> gr.push(element));
            }
        }
        if (policy.actions) {
            policy.actions.forEach(element => {
                delete element["__typename"];
            });
        }
        this.policy= policy;
    }
}
