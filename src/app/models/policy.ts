import { Injectable } from '@angular/core';
import { Entity, PageInfo, Project } from '@app/threat-center/shared/models/types';

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
    rootGroup: PolicyConditionGroup;
    actions: PolicyAction[];
}

@Injectable()
export class PolicyConditionGroup {
    readonly orgId: string;
    readonly policyId: string;
    readonly groupId: string;
    parentGroupId: string;
    groupOperator: string;
    groups: PolicyConditionGroup[];
    conditions: PolicyCondition[];
    constructor() {
        this.groups=[];
        this.conditions=[];
    }
}

export class PolicyCondition {
    readonly orgId: string;
    readonly policyId: string;
    readonly groupId: string;
    readonly conditionId: string;
    conditionType: string;

    // security related condition data
    securitySeverityOperator: string;
    securitySeverityValue: string;
    securityCVSS3ScoreOperator: string;
    securityCVSS3ScoreValue: string;

    // legal related condition data
    legalLicenseFamilyOperator: string;
    legalLicenseFamilyValue: string;
    legalLicenseNameOperator: string;
    legalLicenseNameValue: string;
    legalLicenseTypeOperator: string;
    legalLicenseTypeValue: string;
    legalFoundIn: string;

    // component related condition data
    componentGroupId: string;
    componentArtifactId: string;
    componentVersion: string;
    componentLibraryAgeOperator: string;
    componentLibraryAgeValue: number;
    componentVersBehindOperator: string;
    componentVersBehindValue: number;

    // code quality related condition data
    codeQualityEmbAssetsOperator: string;
    codeQualityEmbAssetsValue: number;

    // workflow related condition data
    workflowReleasePhase: any;
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
        let gr=[policy.rootGroup];
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
