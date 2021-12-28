import { Injectable } from "@angular/core";
import { AttributeAssetRequestInput, ComponentQuery, LicenseQuery, ProjectQuery, Scan, ScanAssetMatch, ScanAssetMatchRequest, ScanAssetQuery, ScanLicenseQuery, ScanQuery, VulnerabilityQuery } from "@app/models";
import gql from "graphql-tag";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";

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
                      status
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
      `, 'cache-first');
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
          `, 'cache-first');
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
          `, 'cache-first');
  }

  // todo: ref: use optional params instead of initializing defaults to undefined
  getComponent(componentId: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
    // todo: ref: eliminate code duplications
    const firstArg = (!!first) ? `first: ${first}` : '';
    const lastArg = (!!last) ? `last: ${last}` : '';
    const afterArg = (after) ? `, after: "${after}"` : '';
    const beforeArg = (before) ? `, before: "${before}"` : '';
    return this.coreGraphQLService.coreGQLReq<ComponentQuery>(gql`
           query {
              component(componentId:"${componentId}") {
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
                licenses {
                  edges {
                    node {
                      licenseId,
                      name,
                      category,
                      style,
                      spdxId,
                      publicationYear
                    }
                  }
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
        `);
  }

  getLicense(licenseId: string) {
    return this.coreGraphQLService.coreGQLReq<LicenseQuery>(gql`
            query {
               license(licenseId:"${licenseId}") {
                   licenseId,
                   name,
                   spdxId
                   body,
                   category,
                   style,
                   type,
                   publicationYear,
                   description,
                   isOsiApproved,
                   isFsfLibre,
                   isDeprecated,
                   attributes {
                     name,
                     type,
                     description
                   }
              }
           }
        `);
  }

  getLicenseAndLicenseComponent(licenseId: string, licenseDiscovery: string, licenseOrigin: string,
    scanId: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined,
    parentScanAssetId: string = undefined, assetFilter: string = undefined) {
    let parentAssetId = (!!parentScanAssetId && parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + parentScanAssetId + '\", ' : "";
    let assetFilterArg = 'filter: \"' + (!!assetFilter ? assetFilter : "") + '\"';
    const firstArg = (!!first) ? `, first: ${first}` : '';
    const lastArg = (!!last) ? `, last: ${last}` : '';
    const afterArg = (after) ? `, after: "${after}"` : '';
    const beforeArg = (before) ? `, before: "${before}"` : '';

    return this.coreGraphQLService.coreGQLReq<ScanLicenseQuery>(gql`
          query {
             scanLicense(scanId:"${scanId}", licenseId:"${licenseId}", licenseDiscovery:"${licenseDiscovery}", licenseOrigin:"${licenseOrigin}") {
                 licenseOrigin,
                 licenseDiscovery
                 license {
                     licenseId,
                     name,
                     spdxId
                     body,
                     category,
                     style,
                     type,
                     publicationYear,
                     description,
                     notes,
                     isOsiApproved,
                     isFsfLibre,
                     isDeprecated,
                     compatible,
                     incompatible,
                     attributes {
                       name,
                       type,
                       description
                     }
                }
                scanComponents(${firstArg}${lastArg}${afterArg}${beforeArg}) {
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
                      lastInheritedRiskScore
                      componentLocation
                      componentDiscoveryMethod
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
                    }
                  }
                }
                scanAssetsTree(${parentAssetId}${assetFilterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                  }
                  totalCount
                  edges {
                    node {
                      name,
                      size,
                      assetSize,
                      scanAssetId,
                      originAssetId
                      workspacePath
                      status,
                      assetType,
                      parentScanAssetId,
                      attributionStatus,
                      matchType,
                      embeddedAssetPercent,
                      matchCount
                    }
                  }
                }
                scanLicenseAssets(first:1) {
                  edges {
                    node {
                      scanAssetId
                    }
                  }
                }
            }
         }
      `);
  }

  getLicenseComponents(licenseId: string, licenseDiscovery: string, licenseOrigin: string, scanId: string,
    first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
    const firstArg = (!!first) ? `, first: ${first}` : '';
    const lastArg = (!!last) ? `, last: ${last}` : '';
    const afterArg = (after) ? `, after: "${after}"` : '';
    const beforeArg = (before) ? `, before: "${before}"` : '';
    return this.coreGraphQLService.coreGQLReq<ScanLicenseQuery>(gql`
          query {
            scanLicense(scanId:"${scanId}", licenseId:"${licenseId}", licenseDiscovery:"${licenseDiscovery}", licenseOrigin:"${licenseOrigin}") {
              licenseId,
              scanComponents(${firstArg}${lastArg}${afterArg}${beforeArg}) {
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
                  }
                }
              }
            }
          }
        `);
  }

  getScanLicenseAssets(licenseId: string, licenseDiscovery: string, licenseOrigin: string, scanId: string = null,
    first = undefined, last = undefined, after: string = undefined, before: string = undefined,
    parentScanAssetId: string = undefined, assetFilter: string = undefined) {
    let parentAssetId = (!!parentScanAssetId && parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + parentScanAssetId + '\", ' : "";
    let assetFilterArg = 'filter: \"' + (!!assetFilter ? assetFilter : "") + '\"';
    const firstArg = (!!first) ? `, first: ${first}` : '';
    const lastArg = (!!last) ? `, last: ${last}` : '';
    const afterArg = (after) ? `, after: "${after}"` : '';
    const beforeArg = (before) ? `, before: "${before}"` : '';
    return this.coreGraphQLService.coreGQLReq<ScanLicenseQuery>(gql`
          query {
            scanLicense(scanId:"${scanId}", licenseId:"${licenseId}", licenseDiscovery:"${licenseDiscovery}", licenseOrigin:"${licenseOrigin}") {
              licenseId,
              scanAssetsTree(${parentAssetId}${assetFilterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                totalCount
                edges {
                  node {
                    name,
                    size,
                    assetSize,
                    scanAssetId,
                    originAssetId
                    workspacePath
                    status,
                    assetType,
                    parentScanAssetId,
                    attributionStatus,
                    matchType,
                    embeddedAssetPercent,
                    matchCount
                  }
                }
              }
            }
          }
        `);
  }

  getVulnerability(vulnerabilityId: string, orgId: string, scanId: string) {
    return this.coreGraphQLService.coreGQLReq<VulnerabilityQuery>(gql`
        query {
            vulnerability(vulnerabilityId:"${vulnerabilityId}") {
              vulnerabilityId,
              vulnId,
              created,
              source,
              description,
              references,
              published,
              updated,
              cwe {
                  cweId,
                  name
              }
              cvssV2BaseScore,
              cvssV2ImpactSubScore,
              cvssV2ExploitabilitySubScore,
              cvssV2Vector,
              cvssV3BaseScore,
              cvssV3ImpactSubScore,
              cvssV3ExploitabilitySubScore,
              cvssV3Vector,
              severity,
              recommendation,
              credits,
              vulnerableVersions,
              patchedVersions,
              title,
              subtitle,
              components(vulnerabilityId:"${vulnerabilityId}" orgId:"${orgId}" scanId:"${scanId}") {
                edges {
                  node {
                    componentId,
                    name,
                    version,
                    group
                  }
                }
              }
          }
        }
      `);
  }

  getScanRepository(scanId: string) {
    return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
       query {
          scan(scanId:"${scanId}") {
            scanRepository {
              repositoryOwner,
              repositoryName
            }
          }
        }
      `);
  }

  getScanAssets(scanId: string, parentScanAssetId: string, filter: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined) {
    let parentId = (parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + parentScanAssetId + '\", ' : "";
    let filterArg = 'filter: \"' + filter + '\"';
    const firstArg = (!!first) ? `first: ${first}` : '';
    const lastArg = (!!last) ? `last: ${last}` : '';
    const afterArg = (after) ? `, after: "${after}"` : '';
    const beforeArg = (before) ? `, before: "${before}"` : '';
    return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
        query {
        	scan(scanId:"${scanId}") {
            scanId
            scanAssetsTree(${parentId}${filterArg}${firstArg}${lastArg}${afterArg}${beforeArg}) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              totalCount
              edges {
                node {
                  orgId,
                  name,
                  size,
                  assetSize,
                  projectId
                  scanAssetId,
                  originAssetId
                  workspacePath
                  status,
                  assetType,
                  parentScanAssetId,
                  attributionStatus,
                  matchType,
                  embeddedAssetPercent,
                  matchCount,
                  component {
                    componentId,
                    name,
                    group,
                    version,
                    isInternal,
                    cpe,
                    description,
                    usedBy
                  }
                }
              }
            }
          }
        }
      `, 'no-cache');
  }

  getScanAsset(scanId: string, scanAssetId: string) {
    return this.coreGraphQLService.coreGQLReq<ScanAssetQuery>(gql`
        query {
        	scanAsset(scanId:"${scanId}" scanAssetId:"${scanAssetId}") {
            name,
            size,
            assetSize
            scanAssetId,
            originAssetId
            workspacePath,
            status,
            percentEmbedded,
            attributionStatus,
            sourceAssetAttribution {
              orgId,
              attributedBy,
              attributedDate,
              attributionStatus,
              attributedComment,
            },
            embeddedAssets {
              edges {
                node {
                  percentMatch,
                  name,
                  assetSize,
                  assetMatchId,
                  originAssetId,
                  earliestReleaseDate,
                  earliestReleaseVersion,
                  latestReleaseDate,
                  latestReleaseVersion,
                  matchRepository{
                    repositoryOwner,
                    repositoryName,
                    repositoryId,
                    repositoryCode
                  },
                  matchGroups {
                    edges {
                        node {
                          name,
                          assetMatchId,
                          earliestReleaseDate,
                          earliestReleaseVersion,
                          latestReleaseDate,
                          latestReleaseVersion,
                        }
                    }
                  },
                  matchLicenses {
                    licenseId,
                    licenseName,
                    licenseCategory,
                    earliestReleaseDate,
                    latestReleaseDate,
                    earliestReleaseVersion,
                    latestReleaseVersion,
                    needIncludeInCode
                  },
                  releases{
                    edges {
                      node {
                        releaseDate,
                        releaseName,
                        licenses {
                          edges {
                            node {
                              licenseId,
                              spdxId,
                              name,
                              shortName,
                              style,
                              category
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,'no-cache');
  }

  // send attribute asset graphql mutation
  attributeAsset(scanId: string, scanAssetId: string, licenses: any[], attributeComment: string): any {
    let attributeAssetRequest = new AttributeAssetRequestInput(scanId, scanAssetId, licenses, attributeComment);
    return this.coreGraphQLService.coreGQLReqForMutation(gql`mutation ($attributeAssetRequest: AttributeAssetRequestInput) {
      attributeAsset(attributeAssetRequest: $attributeAssetRequest)
    }`, { attributeAssetRequest: attributeAssetRequest });
  }

}
