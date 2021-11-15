import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';
import {
  AttributeAssetRequestInput,
  BitbucketUserQuery,
  ComponentQuery,
  EntityListQuery,
  EntityQuery,
  GitHubUserQuery,
  GitLabUserQuery,
  LicenseQuery,
  Period,
  ProjectQuery,
  Scan,
  ScanAssetMatch,
  ScanAssetMatchRequest,
  ScanAssetQuery,
  ScanLicenseQuery,
  ScanQuery, SnippetQuery,
  UserSelection,
  VulnerabilityQuery
} from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userSelection: UserSelection;

  constructor(
    private coreGraphQLService: CoreGraphQLService) { }

  getEntityList() {
    return this.coreGraphQLService.coreGQLReq<EntityListQuery>(gql`query {
      entities {
        edges {
          node {
            entityId,
            parentEntityId,
            name
          }
        }
      }
    }`, 'no-cache');
  }

  getEntity(entityId: string) {
    let childProjects = `
    childProjects(first:100) {
      edges {
        node {
          projectId
          name
          created
          tags
          latestScan {
            scanId
            projectId
            branch
            tag
            version
            created
          }
          projectMetricsSummary {
            measureDateTime
            vulnerabilityMetrics {
              critical
              high
              medium
              low
              info
            }
            licenseMetrics {
              copyleftStrong
              copyleftWeak
              copyleftPartial
              copyleftLimited
              copyleft
              custom
              dual
              permissive
            }
            supplyChainMetrics {
              risk
              quality
            }
            assetMetrics {
              embedded
              openSource
              unique
            }
          }

          %childProjects%
        }
      }
    }`;
    let query = `
    query {
      entity(entityId: "${entityId}") {
        entityId
        parentEntityId
        parents {
          entityId
          name
        }
        name
        entityType
        removed
        entityMetricsSummaryGroup {
          entityMetricsSummaries {
            measureDate
            vulnerabilityMetrics {
                critical
                high
                medium
                low
                info
            }
            licenseMetrics {
                copyleftStrong
                copyleftWeak
                copyleftPartial
                copyleftLimited
                copyleft
                custom
                dual
                permissive
            }
            supplyChainMetrics {
                risk
                quality
            }
            assetMetrics {
                embedded
                openSource
                unique
            }
          }
        }
        entityMetricsGroup {
            projectCount
            entityMetrics{
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
        projects {
          edges {
            node {
              projectId
              name
              created
              tags
              projectMetricsSummary {
                measureDateTime
                vulnerabilityMetrics {
                  critical
                  high
                  medium
                  low
                  info
                }
                licenseMetrics {
                  copyleftStrong
                  copyleftWeak
                  copyleftPartial
                  copyleftLimited
                  copyleft
                  custom
                  dual
                  permissive
                }
                supplyChainMetrics {
                  risk
                  quality
                }
                assetMetrics {
                  embedded
                  openSource
                  unique
                }
			        }
              
              
              %childProjects%
            }
          }
        }
        

        childEntities {
          edges {
            node {
              entityId
              parentEntityId
              name
              entityType
              removed
              
              entityMetricsSummaryGroup {
                entityMetricsSummaries {
                  measureDate
                  vulnerabilityMetrics {
                      critical
                      high
                      medium
                      low
                      info
                  }
                  licenseMetrics {
                      copyleftStrong
                      copyleftWeak
                      copyleftPartial
                      copyleftLimited
                      copyleft
                      custom
                      dual
                      permissive
                  }
                  supplyChainMetrics {
                      risk
                      quality
                  }
                  assetMetrics {
                      embedded
                      openSource
                      unique
                  }
                }  
              }
              
              
            }
          }
        }
      }
    }`;

    // max child project depth = 10
    for (let i = 0; i < 10; i++) {
      query = query.replace("%childProjects%", childProjects);
      query = query.replace("%childEntityChildProjects%", childProjects.replace("%childProjects%", "%childEntityChildProjects%"));
    }
    query = query.replace("%childProjects%", "");
    query = query.replace("%childEntityChildProjects%", "");

    // return this.coreGraphQLService.watchQuery<EntityQuery>({
    //   query: gql(query),
    //   fetchPolicy: 'no-cache'
    // }).valueChanges;

    return this.coreGraphQLService.coreGQLReq<EntityQuery>(gql(query),'no-cache');
  }


  getEntityComponents(entityId: string) {
    return this.coreGraphQLService.coreGQLReq<EntityQuery>(gql`
        query {
          entity(entityId:"${entityId}" ) {
            entityId,
            name,
            entityComponents {
              edges {
                node {
                  componentId
                  name,
                  group,
                  version,
                  entityComponentLicenses {
                    edges {
                      node {
                        licenseId
                        spdxId
                        name,
                        category,
                        shortName,
                        style,
                        category,
                        publicationYear
                      }
                    }
                  }
                  entityComponentVulnerabilities {
                    edges {
                      node {
                        vulnerabilityId,
                        orgId,
                        vulnId,
                        source,
                        published,
                        cwe {
                          cweId,
                          name
                        }
                        cvssV2BaseScore,
                        cvssV3BaseScore,
                        severity,
                        vulnerabilityInfection {
                          infectionId,
                          projectCount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `, 'no-cache');
  }

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
  `,'no-cache');
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
      `,'no-cache');
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
      `,'no-cache');
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
                    licenses {
                      edges {
                        node {
                          licenseId,
                          name,
                          category,
                          spdxId
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
                  }    
                }
              }  
            }    
          }
        `);
  }

  getLicenseAndLicenseComponent(licenseId: string, licenseDiscovery: string, licenseOrigin: string,
                                scanId: string, first = undefined, last = undefined, after: string = undefined, before: string = undefined,
                                parentScanAssetId: string = undefined, assetFilter: string = undefined){
    let parentAssetId = (!!parentScanAssetId && parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + parentScanAssetId + '\", ' : "";
    let assetFilterArg = 'filter: \"' + (!!assetFilter? assetFilter: "") + '\"';
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
                      licenses {
                        edges {
                          node {
                            licenseId,
                            name,
                            category,
                            spdxId
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
                      embeddedAssets {
                        edges {
                          node {
                            name,
                            percentMatch,
                            assetSize
                          }
                        }
                      }
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

  getScanLicenseAssets(licenseId: string, licenseDiscovery: string, licenseOrigin: string, scanId: string = null,
                       first = undefined, last = undefined, after: string = undefined, before: string = undefined,
                       parentScanAssetId: string = undefined, assetFilter: string = undefined) {
    let parentAssetId = (!!parentScanAssetId && parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + parentScanAssetId + '\", ' : "";
    let assetFilterArg = 'filter: \"' + (!!assetFilter? assetFilter: "") + '\"';
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
                    embeddedAssets {
                      edges {
                        node {
                          name,
                          percentMatch,
                          assetSize
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


  getVulnerability(vulnerabilityId: string) {
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
              components{
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
                  embeddedAssets {
                    edges {
                      node {
                        name,
                        percentMatch,
                        assetSize
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `, 'cache-first');
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
                    latestReleaseVersion
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
      `);
  }

  getEntityMetricsPeriod(orgId: string, entityId: string, period: Period) {
    return this.coreGraphQLService.coreGQLReq<LicenseQuery>(gql`
       query {
          entityMetricsPeriod(orgId:"${orgId}" entityId:"${entityId}" period:${period})  {
            projectCount
            entityMetrics {
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
      `,'no-cache');
  }

  getGitHubUser() {
    return this.coreGraphQLService.coreGQLReq<GitHubUserQuery>(gql`
        query {
          gitHubUser {
            id,
            isSiteAdmin
            avatarUrl,
            email,
            location,
            name,
            company,
            url,
            login
            organizations {
              totalCount
              edges {
                node {
                  ... on Organization {
                    id,
                    name,
                    avatarUrl,
                    repositories {
                        totalCount
                        edges {
                          node {
                            ... on Repository {
                              id,
                              name,
                              archived,
                              fork,
                              private,
                              resourcePath,
                              sshUrl,
                              url,
                              primaryLanguage{
                                color,
                                name
                              },
                              defaultBranchRef {
                                name,
                                target {
                                  oid
                                }
                              }
                              refs {
                                edges {
                                  node {
                                    ... on Ref {
                                      id
                                      name,
                                      target {
                                        oid
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
              }
            }
            repositories {
              totalCount
              edges {
                node {
                  ... on Repository {
                    id,
                    name,
                    archived,
                    fork,
                    private,
                    resourcePath,
                    sshUrl,
                    url,
                    primaryLanguage{
                      color,
                      name
                    },
                    defaultBranchRef {
                        name
                      }
                      refs {
                        edges {
                          node {
                            ... on Ref {
                              id
                              name
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

  // Request gitlab repos data from backend
  getGitLabUser() {
    return this.coreGraphQLService.coreGQLReq<GitLabUserQuery>(
      gql`
          query {
            gitLabUser {
              id,
              avatarUrl,
              email,
              name,
              username,
              gitLabProjects {
                id,
                name,
                fullPath,
                description,
                httpUrlToRepo,
                sshUrlToRepo,
                path,
                webUrl,
                archived,
                createdAt,
                repository {
                    rootRef,
                    exists
                }
              }
            }
          }
        `
    );
  }


  // Request bitbucket repos data from backend
  getBitbucketUser() {
    return this.coreGraphQLService.coreGQLReq<BitbucketUserQuery>(
      gql`
          query {
            bitbucketUser {
              id,
              name,
              username,
              state,
              email,
              avatarUrl,
              webUrl,
              organization,
              bitBucketRepositories {
                  name,
                  fullName,
                  url,
                  sshUrl,
                  owner,
                  createdOn,
                  description,
                  language,
                  mainBranch,
                  branches
              }
            }
          }
      `);
  }


  // send attribute asset graphql mutation
  attributeAsset(scanId: string, scanAssetId: string, assetMatches: ScanAssetMatch[], attributeStatus: string, attributeComment: string): any {
    const assetMatchesInput = [];
    for (let match of assetMatches) {
      assetMatchesInput.push(new ScanAssetMatchRequest(match.assetMatchId, match.percentMatch));
    }
    let attributeAssetRequest = new AttributeAssetRequestInput(scanId, scanAssetId, assetMatchesInput, attributeStatus, attributeComment);
    return this.coreGraphQLService.coreGQLReqForMutation(gql`mutation ($attributeAssetRequest: AttributeAssetRequestInput) {
      attributeAsset(attributeAssetRequest: $attributeAssetRequest)
    }`, { attributeAssetRequest: attributeAssetRequest });
  }

  getSnippetMatches(snippetText: string, languageType: string) {
    return this.coreGraphQLService.coreGQLReq<SnippetQuery>(gql`
      query ($snippetText: String $languageType: String){
          snippetMatchResult(snippetText: $snippetText languageType: $languageType) {
            matchTime,
            scanTime,
            snippetSize,
            snippetMatches {
              matchAssetId,
              repositoryName,
              repositoryOwner,
              assetName,
              matchPercent,
              earliestRelease {
                releaseDate,
                releaseName
              },
              latestRelease {
                releaseDate,
                releaseName
              },
              earliestReleaseLicenses {
                licenseId,
                licenseName
              },
              latestReleaseLicenses {
                licenseId,
                licenseName
              },
              assetLicenses {
                licenseId,
                name
              }
            }
          }
      }
    `,'no-cache', { snippetText: snippetText, languageType: languageType });
  }

}
