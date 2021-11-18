import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";
import { EntityListQuery, EntityQuery, LicenseQuery, Period } from "@app/models";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EntityService {
    constructor(private coreGraphQLService: CoreGraphQLService) { }

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

        return this.coreGraphQLService.coreGQLReq<EntityQuery>(gql(query), 'no-cache');
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
          `, 'no-cache');
    }

    getTreeEntity(entityId: string): Observable<ApolloQueryResult<EntityQuery>> {
        return this.coreGraphQLService.coreGQLReqWithQuery<EntityQuery>(
            gql`
            query {
              entity(entityId: "${entityId}") {
                entityId
                parentEntityId
                name
                entityType
                removed
                parents {
                  entityId
                  name
                }
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
                childEntities {
                  edges {
                    node {
                      entityId
                      parentEntityId
                      name
                      entityType
                      removed
                    }
                  }    
                }
              }
            }
          `, "no-cache");
    }
}