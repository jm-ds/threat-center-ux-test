import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {
    BitbucketUserQuery,
    ComponentQuery,
    EntityListQuery,
    EntityQuery,
    GitHubUserQuery,
    GitLabUserQuery,
    LicenseQuery,
    ProjectQuery,
    Scan,
    ScanAssetQuery,
    ScanQuery,
    UserSelection,
    VulnerabilityQuery
} from '../models/types';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userSelection: UserSelection;

  constructor(
      private apollo: Apollo,
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
    }`,'no-cache');
  }

  getEntity(entityId:string) {
    let childProjects = `
    childProjects(first:1000) {
      edges {
        node {
          projectId
          name
          created
          latestScan {
            scanId
            projectId
            branch
            tag
            version
            created
            scanMetrics {
              vulnerabilityMetrics {
                critical
                high
                medium
                low
                info
                avgCvss2
                avgCvss3
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
                total
              }
              componentMetrics {
                notLatest
                latest
                vulnerabilities
                riskyLicenses
              }
              assetMetrics {
                embedded
                analyzed
                skipped
              }
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
        name
        entityType
        removed
        projects {
          edges {
            node {
              projectId
              name
              created
              latestScan {
                scanId
                projectId
                branch
                tag
                version
                created
                scanMetrics {
                  vulnerabilityMetrics {
                    critical
                    high
                    medium
                    low
                    info
                    avgCvss2
                    avgCvss3
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
                    total
                  }
                  componentMetrics {
                    notLatest
                    latest
                    vulnerabilities
                    riskyLicenses
                  }
                  assetMetrics {
                    embedded
                    analyzed
                    skipped
                  }
                }
              }
              %childProjects%
            }
          }
        }
        entityMetrics {
          projectCount
          vulnerabilityMetrics {
            total
            critical
            high
            medium
            low
            info
            avgCvss2
            avgCvss3
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
            total
          }
          componentMetrics {
            total
            notLatest
            latest
            vulnerabilities
            riskyLicenses
          }
          assetMetrics {
            total
            embedded
            analyzed
            skipped
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
              projects {
                edges {
                  node {
                    projectId
                    name
                    created
                    latestScan {
                      scanId
                      projectId
                      branch
                      tag
                      version
                      created
                      scanMetrics {
                        vulnerabilityMetrics {
                          critical
                          high
                          medium
                          low
                          info
                          avgCvss2
                          avgCvss3
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
                          total
                        }
                        componentMetrics {
                          notLatest
                          latest
                          vulnerabilities
                          riskyLicenses
                        }
                        assetMetrics {
                          embedded
                          analyzed
                          skipped
                        }
                      }
                    }
                    %childEntityChildProjects%                    
                  }
                }
              }
              entityMetrics {
                projectCount
                vulnerabilityMetrics {
                  total
                  critical
                  high
                  medium
                  low
                  info
                  avgCvss2
                  avgCvss3
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
                  total
                }
                componentMetrics {
                  total
                  notLatest
                  latest
                  vulnerabilities
                  riskyLicenses
                }
                assetMetrics {
                  total
                  embedded
                  analyzed
                  skipped
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
      query = query.replace("%childEntityChildProjects%", childProjects.replace("%childProjects%","%childEntityChildProjects%"));
    }
    query = query.replace("%childProjects%", "");
    query = query.replace("%childEntityChildProjects%", "");

    return this.apollo.watchQuery<EntityQuery>({
      query: gql(query),
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }


  getEntityComponents(entityId:string) {
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

  getProject(projectId:string) {
   return this.coreGraphQLService.coreGQLReq<ProjectQuery>(gql`
        query {
            project(projectId:"${projectId}") {
              projectId,
              entityId,
              name,
              scans {
                edges {
                  node {
                    scanId,
                    projectId,
                    branch,
                    tag,
                    version
                    created,
                    scanMetrics {
                      vulnerabilityMetrics {
                        critical,
                        high,
                        medium,
                        low,
                        info,
                        avgCvss2,
                        avgCvss3
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
                         total
                      },
                      componentMetrics {
                        notLatest,
                        vulnerabilities,
                        riskyLicenses
                      },
                      assetMetrics {
                        embedded,
                        analyzed,
                        skipped
                      }
                    }
                  }
                }
              }
              }
        }
      `,'no-cache');
  }

  getScanVulnerabilities(scanId:string) {
    return this.coreGraphQLService.coreGQLReq<Scan>(gql`
        query {
          scan(scanId:"${scanId}") {
            scanId,
            components {
              edges {
                node {
                  componentId,
                  name,
                  group,
                  version,
                  vulnerabilities {
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
                }
              }
            }
        	}
        }
      `);
  }

  getScanComponents(scanId:string) {
      return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
          query {
            scan(scanId:"${scanId}") {
              scanId,
              components {
                edges {
                  node {
                    componentId,
                    name,
                    group,
                    version,
                    isInternal,
                    lastInheritedRiskScore,
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
      `);
  }

  getScanLicenses(scanId:string) {
     return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
         query {
            scan(scanId:"${scanId}") {
              scanId,
              licenses {
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
                    isFsfLibre
                  }
                }
              }
            }
          }
      `);
  }

  getComponent(componentId:string) {
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
              vulnerabilities {
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

  getLicense(licenseId:string) {
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
                     key,
                     attributeType
                 }
            }
         }
      `);
  }

  getVulnerability(vulnerabilityId:string) {
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


  getScanRepository(scanId:string) {
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

  getScanAssets(scanId:string) {
    return this.coreGraphQLService.coreGQLReq<ScanQuery>(gql`
        query {
        	 scan(scanId:"${scanId}") {
            scanId
            scanAssets {
              edges {
                node {
                  name,
                  size,
                  assetSize,
                  scanAssetId,
                  originAssetId
                  workspacePath
                  status,
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

  getScanAsset(scanId:string,scanAssetId:string) {
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
            embeddedAssets {
              edges {
                node {
                  percentMatch,
                  name,
                  assetSize,
                  originAssetId,
                  matchRepository{
                    repositoryOwner,
                    repositoryName,
                    repositoryId
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
      `);
  }

    // Request gitlab repos data from backend
    getGitLabUser() {
        return this.apollo.watchQuery<GitLabUserQuery>({
            query: gql`
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
              `,
        }).valueChanges;
    }


    // Request bitbucket repos data from backend
    getBitbucketUser() {
        return this.apollo.watchQuery<BitbucketUserQuery>({
            query: gql`
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
              `,
        }).valueChanges;
    }
}
