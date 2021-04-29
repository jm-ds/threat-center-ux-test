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
        let filter=this.collectString(entityIdParam, projectIdParam, onlyActiveParam);
        if (filter) {
            filter = '('+filter+')';
        }
        
        
        return this.apollo.watchQuery<PoliciesQuery>({
            query: gql(`query {
                policies ${filter} {
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
                dateLastStateChange
                overridePolicyId
                overridePolicyTitle
                conditions {
                    groupOperator
                    groups {
                      groupOperator
                      conditions {
                        conditionName
                        conditionType
                        conditionDataType
                        decimalValue
                        doubleValue
                        intValue
                        operator
                        severityValue
                        strValue
                        threshold
                        autoAdjustThreshold
                        logicalOperator
                      }
                    }
                }
                actions {
                    actionType, actionName
                }
            }
        }`;
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
                    active,
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


    // enable/disable policy
    enablePolicy(policy: Policy) {
        const policyRequest = new PolicyRequestInput(policy);

        return this.apollo.mutate({
            mutation: gql`mutation ($policyRequest: PolicyRequestInput) {
                enablePolicy(policyRequest: $policyRequest) {
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
            "SUPPLY_CHAIN": "Supply Chain" /*,
            "CODE_QUALITY": "Code quality",
            "RELEASE_STAGE": "Release Stage"*/
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
