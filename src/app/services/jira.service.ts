import {Injectable} from '@angular/core';
import {CoreGraphQLService} from "@app/services/core/core-graphql.service";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})
export class JiraService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    createVulnerabilityJiraTicket(vulnerabilityId: string, orgId: string, scanId: string, content: string) {
        const vulnerabilityJiraRequest = new VulnerabilityJiraRequestInput(vulnerabilityId, orgId, scanId, content);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`
                mutation ($vulnerabilityJiraRequest: VulnerabilityJiraRequestInput){
                    createVulnerabilityJiraTicket(jiraRequest: $vulnerabilityJiraRequest){
                        url, status, id
                    }
                }
                `, {vulnerabilityJiraRequest}
        );
    }

}

export class VulnerabilityJiraRequestInput {
    readonly vulnerabilityId: string;
    readonly orgId: string;
    readonly scanId: string;
    readonly content: string;

    constructor(vulnerabilityId: string, orgId: string, scanId: string, content: string) {
        this.vulnerabilityId = vulnerabilityId;
        this.orgId = orgId;
        this.scanId = scanId;
        this.content = content;
    }
}
