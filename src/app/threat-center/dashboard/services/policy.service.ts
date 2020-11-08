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

    getPolicyList(onlyActive: Boolean) {
        let filter = (onlyActive==undefined)?``:`(onlyActive: ${onlyActive})`;
        return this.apollo.watchQuery<PoliciesQuery>({
            query: gql(`query {
                policies ${filter} {
                    edges {
                      node {
                        orgId
                        policyId
                        name
                        active
                        title
                        description
                      }
                    }
                }
            }`),
            fetchPolicy: 'no-cache'
        }).valueChanges;
    }

    getPolicy(policyId: string) {
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
            policy(policyId: "${policyId}") {
                orgId
                policyId
                name
                title
                description
                createdBy
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
                    policyId
                }
            }`,
            variables: {
                policyRequest: policyRequest
            }
        });
    }

    removePolicy(policy: Policy) {
        const policyRequest = new PolicyRequestInput(policy);

        return this.apollo.mutate({
            mutation: gql`mutation ($policyRequest: PolicyRequestInput) {
                removePolicy(policyRequest: $policyRequest) {
                    orgId,
                    policyId,
                    active
                }
            }`,
            variables: {
                policyRequest: policyRequest
            }
        });

    }

}
