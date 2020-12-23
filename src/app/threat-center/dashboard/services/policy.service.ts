import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {PoliciesQuery, Policy, PolicyQuery, PolicyRequestInput} from "@app/models";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})
export class PolicyService {

    constructor(private apollo: Apollo) {
    }

    getPolicyList(entityId: string, projectId: string, onlyActive: Boolean) {
        const entityIdParam = (!!entityId) ? `entityId: "${entityId}"` : '';
        const projectIdParam = (!!projectId) ? `projectId: "${projectId}"` : '';
        const onlyActiveParam = (!!onlyActive) ? `onlyActive: ${onlyActive}` : '';
        const filter=this.collectString(entityIdParam, projectIdParam, onlyActiveParam);
        
        return this.apollo.watchQuery<PoliciesQuery>({
            query: gql(`query {
                policies (${filter}) {
                    edges {
                      node {
                        orgId
                        entityId
                        projectId
                        policyId
                        name
                        active
                        title
                        conditionType
                        description
                      }
                    }
                }
            }`),
            fetchPolicy: 'no-cache'
        }).valueChanges;
    }

    getPolicy(entityId: string, projectId: string, policyId: string) {
        const entityIdParam = (!!entityId) ? `entityId: "${entityId}"` : '';
        const projectIdParam = (!!projectId) ? `projectId: "${projectId}"` : '';
        const policyIdParam = (!!policyId) ? `policyId: "${policyId}"` : '';
        const params=this.collectString(entityIdParam, projectIdParam, policyIdParam);
        let groupsQuery = `groups {
            policyId
            groupId
            parentGroupId
            groupOperator
            conditions {
                policyId
                groupId
                conditionId
                conditionType
                securitySeverityOperator
                securitySeverityValue
                securityCVSS3ScoreOperator
                securityCVSS3ScoreValue
                legalLicenseFamilyOperator
                legalLicenseFamilyValue
                legalLicenseNameOperator
                legalLicenseNameValue
                legalLicenseTypeOperator
                legalLicenseTypeValue
                legalFoundIn
                componentGroupId
                componentArtifactId
                componentVersion
                componentLibraryAgeOperator
                componentLibraryAgeValue
                componentVersBehindOperator
                componentVersBehindValue
                codeQualityEmbAssetsOperator
                codeQualityEmbAssetsValue
                workflowReleasePhase
            }
            %groups%
        }`;
        let query = `query {
            policy(${params}) {
                orgId
                policyId
                entityId
                projectId
                name
                title
                description
                applyToChilds
                conditionType
                createdBy
                entity {
                    name
                } 
                project {
                    name
                }
                active
                createDate
                dateRemoved
                rootGroup {
                    policyId
                    groupId
                    parentGroupId
                    groupOperator
                    conditions {
                        policyId
                        groupId
                        conditionId
                        conditionType
                        securitySeverityOperator
                        securitySeverityValue
                        securityCVSS3ScoreOperator
                        securityCVSS3ScoreValue
                        legalLicenseFamilyOperator
                        legalLicenseFamilyValue
                        legalLicenseNameOperator
                        legalLicenseNameValue
                        legalLicenseTypeOperator
                        legalLicenseTypeValue
                        legalFoundIn
                        componentGroupId
                        componentArtifactId
                        componentVersion
                        componentLibraryAgeOperator
                        componentLibraryAgeValue
                        componentVersBehindOperator
                        componentVersBehindValue
                        codeQualityEmbAssetsOperator
                        codeQualityEmbAssetsValue
                        workflowReleasePhase
                    }
                    %groups%
                }
                actions {
                    actionType, actionName
                }
            }
        }`;
        // max group depth - 10
        for (let i = 0; i < 10; i++) {
            query = query.replace("%groups%", groupsQuery);
        }
        query = query.replace("%groups%", "");
        return this.apollo.watchQuery<PolicyQuery>({
            query: gql(query),
            fetchPolicy: 'no-cache'
        }).valueChanges;
    }

    savePolicy(policy: Policy): any {
        const policyRequest = new PolicyRequestInput(policy);

        return this.apollo.mutate({
            mutation: gql`mutation ($policyRequest: PolicyRequestInput) {
                createPolicy(policyRequest: $policyRequest) {
                    orgId,
                    entityId,
                    projectId,
                    policyId
                }
            }`,
            variables: {
                policyRequest: policyRequest
            }
        });
    }

    // clear uuid if null uuid  
    nullUUID(uuid) {
        if (uuid==="00000000-0000-0000-0000-000000000000") {
            return undefined;
        } else {
            return uuid;
        }
    }

    collectString(...strings) {
        let result='';
        for (const str of strings) {
            if (!!str) {
                if (!!result) {
                    result=result+',';
                }
                result=result+str;
            }
        }
        return result;
    }



    removePolicy(policy: Policy) {
        const policyRequest = new PolicyRequestInput(policy);

        return this.apollo.mutate({
            mutation: gql`mutation ($policyRequest: PolicyRequestInput) {
                removePolicy(policyRequest: $policyRequest) {
                    orgId,
                    entityId,
                    projectId,
                    policyId,
                    active
                }
            }`,
            variables: {
                policyRequest: policyRequest
            }
        });

    }

    getConditionTypes() {
        return {
            "SECURITY": "Security",
            "LEGAL": "Legal",
            "COMPONENT": "Component" ,
            "CODE_QUALITY": "Code quality",
            "WORKFLOW": "Workflow"
        };
    }

    getConditionTypeItems() {
        let conditionTypes = this.getConditionTypes();
        let conditionTypeItems = [];
        for (const key in conditionTypes) {
            if (Object.prototype.hasOwnProperty.call(conditionTypes, key)) {
                conditionTypeItems.push({code: key, name: conditionTypes[key]})
            }
        }
        return conditionTypeItems;
    }

}
