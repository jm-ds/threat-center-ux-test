import {Injectable} from '@angular/core';
import {CoreGraphQLService} from "@app/services/core/core-graphql.service";
import gql from "graphql-tag";
import {JiraTicketQuery} from "@app/models";

@Injectable({
    providedIn: 'root'
})
export class JiraService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    // Request the backend to create a jira ticket from Vulnerability details page
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

    // Request the backend to create a jira ticket from license details page
    createLicenseJiraTicket(licenseId, projectId, scanId, orgId, content: string) {
        const licenseJiraRequest = new LicenseJiraRequestInput(licenseId, projectId, scanId, orgId, content);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`
                mutation ($licenseJiraRequest: LicenseJiraRequestInput){
                    createLicenseJiraTicket(jiraRequest: $licenseJiraRequest){
                        id, key, self
                    }
                }
                `, {licenseJiraRequest}
        );
    }

    // Request the backend to get a jira ticket for selected license
    getLicenseJiraTicket(licenseId, scanId, orgId: string) {
        return this.coreGraphQLService.coreGQLReq<JiraTicketQuery>(gql`
          query {
             licenseJiraTicket(licenseId:"${licenseId}" orgId:"${orgId}" scanId:"${scanId}") {
                 id, key, self
             }
         }`);
    }

    // Request the backend to create a jira ticket from Scan asset details page
    createScanAssetMatchJiraTicket(assetMatchId, projectId, scanId, orgId, content: string) {
        const scanAssetMatchRequest = new ScanAssetMatchJiraRequestInput(assetMatchId, projectId, scanId, orgId, content);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`
                mutation ($scanAssetMatchRequest: ScanAssetMatchJiraRequestInput){
                    createScanAssetMatchJiraTicket(jiraRequest: $scanAssetMatchRequest){
                        id, key, self
                    }
                }
                `, {scanAssetMatchRequest}
        );
    }
}

export class ScanAssetMatchJiraRequestInput {
    readonly assetMatchId: string;
    readonly projectId: string;
    readonly scanId: string;
    readonly orgId: string;
    readonly content: string;

    constructor(assetMatchId: string, projectId: string, scanId: string, orgId: string, content: string) {
        this.assetMatchId = assetMatchId;
        this.projectId = projectId;
        this.scanId = scanId;
        this.orgId = orgId;
        this.content = content;
    }
}

export class LicenseJiraRequestInput {
    readonly licenseId: string;
    readonly projectId: string;
    readonly scanId: string;
    readonly orgId: string;
    readonly content: string;

    constructor(licenseId: string, projectId: string, scanId: string, orgId: string, content: string) {
        this.licenseId = licenseId;
        this.projectId = projectId;
        this.scanId = scanId;
        this.orgId = orgId;
        this.content = content;
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
