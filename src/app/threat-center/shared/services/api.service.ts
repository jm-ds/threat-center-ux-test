import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import {
  GitHubUserQuery,
  ProjectQuery,
  EntityQuery,
  ScanQuery,
  VulnerabilityQuery,
  ComponentQuery,
  LicenseQuery,
  Branch,
  UserSelection,
  Vulnerability,
  Scan,
  Project,
  Entity,
  License,
  ScanAssetQuery,
  EntityListQuery
} from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userSelection: UserSelection;

  constructor(private apollo: Apollo) { }

  getEntityList() {
    return this.apollo.watchQuery<EntityListQuery>({
      query: gql`query {
          entities {
              entityId,
              parentEntityId,
              name
          }
      }`,
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getEntity(entityId:string) {
    return this.apollo.watchQuery<EntityQuery>({
      query: gql`
        query {
          entity(entityId:"${entityId}" ) {
            entityId,
            parentEntityId,
            name,
            projects {
              projectId,
              name,
              created
              childProjects {
                projectId,
                name,
                created
              },
              latestScan {
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
                    latest,
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
            },
            entityMetrics {
              projectCount,
              vulnerabilityMetrics {
                total,
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
                total,
                notLatest,
                latest,
                vulnerabilities,
                riskyLicenses
              },
              assetMetrics{
                total,
                embedded,
                analyzed,
                skipped
              }
            },

             childEntities {
                entityId,
                parentEntityId,
                name,
                projects {
                  projectId,
                  name,
                  created
                  childProjects {
                    projectId,
                    name,
                    created
                  },
                  latestScan {
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
                        latest,
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
                },
                entityMetrics {
                  projectCount,
                  vulnerabilityMetrics {
                    total,
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
                    total,
                    notLatest,
                    latest,
                    vulnerabilities,
                    riskyLicenses
                  },
                  assetMetrics{
                    total,
                    embedded,
                    analyzed,
                    skipped
                  }
                }
              }


          }
        }
      `,
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getEntityComponents(entityId:string) {
    return this.apollo.watchQuery<EntityQuery>({
      query: gql`
        query {
          entity(entityId:"${entityId}" ) {
            entityId,
            name,
            entityComponents {
              componentId
              name,
              group,
              version,
              entityComponentLicenses {
                licenseId
                spdxId
                name,
                category,
                shortName,
                style,
                category,
                publicationYear
              }
              entityComponentVulnerabilities {
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
      `,
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getProject(projectId:string) {
    return this.apollo.watchQuery<ProjectQuery>({
      query: gql`
        query {
            project(projectId:"${projectId}") {
            projectId,
            name,
            scans {
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
      `,
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  getScanVulnerabilities(scanId:string) {
    return this.apollo.watchQuery<Scan>({
      query: gql`
        query {
          scan(scanId:"${scanId}") {
            scanId,
            components {
            componentId,
              name,
              group,
              version,
              vulnerabilities {
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
      `,
    }).valueChanges;
  }

  getScanComponents(scanId:string) {
      return this.apollo.watchQuery<ScanQuery>({
        query: gql`
          query {
            scan(scanId:"${scanId}") {
              scanId,
              components {
                componentId,
                name,
                group,
                version,
                isInternal,
                lastInheritedRiskScore,
                licenses {
                  licenseId,
                  name,
                  category
                }
                resolvedLicense {
                  licenseId,
                  name
                }
                vulnerabilities {
                  vulnerabilityId,
                  vulnId,
                  severity
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
      `,
    }).valueChanges;
  }

  getScanLicenses(scanId:string) {
      return this.apollo.watchQuery<ScanQuery>({
        query: gql`
         query {
            scan(scanId:"${scanId}") {
              scanId,
              licenses {
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
      `,
    }).valueChanges;
  }

  getComponent(componentId:string) {
      return this.apollo.watchQuery<ComponentQuery>({
        query: gql`
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
                licenseId,
                name,
                category,
                style,
                spdxId,
                publicationYear
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
      `,
    }).valueChanges;
  }

  getLicense(licenseId:string) {
      return this.apollo.watchQuery<LicenseQuery>({
        query: gql`
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
      `,
    }).valueChanges;
  }

  getVulnerability(vulnerabilityId:string) {
    return this.apollo.watchQuery<VulnerabilityQuery>({
      query: gql`
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
                    componentId,
                    name,
                    version,
                    group
                }
            }
        }
      `,
    }).valueChanges;
  }


  getScanRepository(scanId:string) {
    return this.apollo.watchQuery<ScanQuery>({
      query: gql`
       query {
          scan(scanId:"${scanId}") {
            scanRepository {
              repositoryOwner,
              repositoryName
            }
          }
        }
      `,
    }).valueChanges;
  }

  getScanAssets(scanId:string) {
    return this.apollo.watchQuery<ScanQuery>({
      query: gql`
        query {
        	 scan(scanId:"${scanId}") {
            scanId
            scanAssets {
              name,
              size,
              assetSize,
              scanAssetId,
              originAssetId
              workspacePath
              status,
              embeddedAssets {
                name,
                percentMatch,
                assetSize
              }
            }
          }
        }
      `,
    }).valueChanges;
  }

  getScanAsset(scanId:string,scanAssetId:string) {
    return this.apollo.watchQuery<ScanAssetQuery>({
      query: gql`
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
                releaseDate,
                releaseName,
                licenses {
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
      `,
    }).valueChanges;
  }


  getGitHubUser() {
    return this.apollo.watchQuery<GitHubUserQuery>({
      query: gql`
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
      `,
    }).valueChanges;
  }
}
