import {Injectable} from '@angular/core';
import {CoreGraphQLService} from "@app/services/core/core-graphql.service";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})
export class JiraService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    createVulnerabilityJiraTicket(vulnerabilityId: string, projectId: string, scanId: string, orgId: string, vulnId: string, content: string) {
        const vulnerabilityJiraRequest = new VulnerabilityJiraRequestInput(vulnerabilityId, projectId, scanId, orgId, vulnId, content);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`
                mutation ($vulnerabilityJiraRequest: VulnerabilityJiraRequestInput){
                    createVulnerabilityJiraTicket(jiraRequest: $vulnerabilityJiraRequest){
                        id, key, self
                    }
                }
                `, {vulnerabilityJiraRequest}
        );
    }

}

export class VulnerabilityJiraRequestInput {
    readonly vulnerabilityId: string;
    readonly projectId: string;
    readonly scanId: string;
    readonly orgId: string;
    readonly vulnId: string;
    readonly content: string;

    constructor(vulnerabilityId: string, projectId: string, scanId: string, orgId: string, vulnId: string, content: string) {
        this.vulnerabilityId = vulnerabilityId;
        this.projectId = projectId;
        this.scanId = scanId;
        this.orgId = orgId;
        this.vulnId = vulnId;
        this.content = content;
    }
}
