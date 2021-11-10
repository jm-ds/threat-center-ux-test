import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/services/core-graphql.service";
import { ScanComponentQuery } from "@app/models";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})

export class ScanComponentService {

    constructor(private apollo: Apollo, private coreGraphQLService: CoreGraphQLService) {}

    getScanComponent(scanId, componentId, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
        const firstArg = (!!first) ? `first: ${first}` : '';
        const lastArg = (!!last) ? `last: ${last}` : '';
        const afterArg = (after) ? `, after: "${after}"` : '';
        const beforeArg = (before) ? `, before: "${before}"` : '';

        return this.coreGraphQLService.coreGQLReq<ScanComponentQuery>(gql`
        query {
            scanComponent(scanId: "${scanId}", componentId: "${componentId}") {
                componentId
                name
                group
                version
                releaseDate
                
                component {
                    componentId,
                    name,
                    group,
                    version,
                    isInternal,
                    cpe,
                    description
                    usedBy,
                    lastInheritedRiskScore,
                    copyrightList {
                        text,
                        startYear,
                        endYear,
                        owners,
                        toPresent
                    }
                    repositoryMeta {
                        repositoryType,
                        namespace,
                        name,
                        latestVersion,
                        published,
                        lastCheck
                    }
                    vulnerabilities(${firstArg}${lastArg}${afterArg}${beforeArg}) {
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                            startCursor
                            endCursor
                        }
                        totalCount
                        edges {
                            node {
                                vulnerabilityId,
                                vulnId,
                                source,
                                recommendation,
                                vulnerableVersions,
                                patchedVersions
                                published,
                                cwe {
                                    cweId,
                                    name
                                },
                                cvssV2BaseScore,
                                cvssV3BaseScore,
                                severity
                            }
                        }
                    }
                    metrics {
                        critical,
                        high,
                        medium,
                        low,
                        unassigned,
                        vulnerabilities,
                        suppressed,
                        findingsTotal,
                        findingsAudited,
                        findingsUnaudited,
                        inheritedRiskScore,
                        firstOccurrence,
                        lastOccurrence
                    }
                },
                licenses {
                    edges {
                        node {
                            licenseId,
                            name,
                            category,
                            style,
                            type,
                            spdxId,
                            publicationYear,
                            licenseDiscovery,
                            licenseOrigin,
                            isOsiApproved,
                            isFsfLibre,
                            trustLevel
                        }
                    }
                }
            }
        }
        `);
    } // getScanComponent
    

}
