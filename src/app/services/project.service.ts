import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/core/services/core-graphql.service";
import { ProjectQuery, Scan, ScanQuery } from "@app/models";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})

export class ProjectService {
    constructor(private coreGraphQLService: CoreGraphQLService) { }

    getProject(projectId: string, filter: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
        const filterArg = 'filterBranchName: \"' + filter + '\",';
        const firstArg = (!!first) ? `first: ${first}` : '';
        const lastArg = (!!last) ? `, last: ${last}` : '';
        const afterArg = (after) ? `, after: "${after}"` : '';
        const beforeArg = (before) ? `, before: "${before}"` : '';
        return this.coreGraphQLService.coreGQLReq<ProjectQuery>(gql`
            query {
              project(projectId: "${projectId}") {
                projectId
                entityId
                name
                scans(${filterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                  }
                  totalCount
                  edges {
                    node {
                      scanId
                      projectId
                      branch
                      tag
                      version
                      versionHash
                      created
                      errorMsg
                      log,
                      scanMetricsSummary {
                        vulnerabilityMetrics {
                          critical,
                          high,
                          medium,
                          low,
                          info,
                        },
                        licenseMetrics {
                          copyleftStrong,
                           copyleftWeak,
                           copyleftPartial,
                           copyleftLimited,
                           copyleft,
                           custom,
                           dual,
                           permissive,
                        },
                        supplyChainMetrics {
                          risk
                          quality
                        }
                        assetMetrics {
                          embedded,
                          openSource,
                          unique
                        }
                      }
                    }
                  }
                }
                projectMetricsGroup {
                  projectMetrics{
                      measureDate
                      vulnerabilityMetrics {
                          severityMetrics
                      }
                      assetMetrics {
                          assetCompositionMetrics
                      }
                      componentMetrics {
                          vulnerabilityMetrics
                          licenseCategoryMetrics
                          licenseFamilyMetrics
                          licenseNameMetrics
                      }
                      licenseMetrics {
                          licenseCategoryMetrics
                          licenseFamilyMetrics
                          licenseNameMetrics
                      }
                      supplyChainMetrics {
                          supplyChainMetrics
                      }
                  }
                }
              }
            }
          `, 'no-cache');
    }

    getScanVulnerabilities(scanId: string, filter: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
        let vulnFilterArg = 'filter: \"' + filter + '\"';
        const firstArg = (!!first) ? `first: ${first}` : '';
        const lastArg = (!!last) ? `last: ${last}` : '';
        const afterArg = (after) ? `, after: "${after}"` : '';
        const beforeArg = (before) ? `, before: "${before}"` : '';
        return this.coreGraphQLService.coreGQLReq<Scan>(gql`
          query {
            scan(scanId:"${scanId}") {
                scanId,
                vulnerabilities(${vulnFilterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                  pageInfo {
                     hasNextPage
                     hasPreviousPage
                     startCursor
                     endCursor
                   }
                   totalCount
                    edges {
                        node {
                            components {
                              edges {
                                node {
                                  group,
                                  name,
                                  version
                                }
                              }
                            }
                            vulnerabilityId,
                            vulnId,
                            source,
                            recommendation,
                            vulnerableVersions,
                            patchedVersions
                            published,
                            cwe{
                                cweId,
                                name
                            },
                            cvssV2BaseScore,
                            cvssV3BaseScore,
                            severity
                        }
                    }
                }
            }
          }
      `, 'no-cache');
    }

    getScanComponents(scanId: string, filter: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
        let compFilterArg = 'filter: \"' + filter + '\"';
        const firstArg = (!!first) ? `first: ${first}` : '';
        const lastArg = (!!last) ? `last: ${last}` : '';
        const afterArg = (after) ? `, after: "${after}"` : '';
        const beforeArg = (before) ? `, before: "${before}"` : '';
        return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
              query {
                scan(scanId:"${scanId}") {
                  scanId,
                  components(${compFilterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                    totalCount
                    edges {
                      node {
                        componentId,
                        name,
                        group,
                        version,
                        isInternal,
                        lastInheritedRiskScore,
                        componentType, 
                        componentLocation,
                        componentDiscoveryMethod,
                        licenses {
                          edges {
                            node {
                              licenseId,
                              name,
                              category
                            }
                          }
                        }
                        resolvedLicense {
                          licenseId,
                          name
                        }
                        vulnerabilities {
                          edges {
                            node {
                              vulnerabilityId,
                              vulnId,
                              severity,
                              patchedVersions
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
                      }
                    }
                  }
                }
              }
          `, 'no-cache');
    }

    getScanLicenses(scanId: string, filter: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
        let filterArg = 'filter: \"' + filter + '\"';
        const firstArg = (!!first) ? `first: ${first}` : '';
        const lastArg = (!!last) ? `last: ${last}` : '';
        const afterArg = (after) ? `, after: "${after}"` : '';
        const beforeArg = (before) ? `, before: "${before}"` : '';
        return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
             query {
                scan(scanId:"${scanId}") {
                  scanId,
                  licenses(${filterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                    totalCount
                    edges {
                      node {
                        licenseId,
                        spdxId
                        name,
                        category,
                        style,
                        type,
                        spdxId,
                        publicationYear,
                        isOsiApproved,
                        isFsfLibre,
                        licenseDiscovery,
                        licenseOrigin,
                        trustLevel
                      }
                    }
                  }
                }
              }
          `, 'no-cache');
      }
}
