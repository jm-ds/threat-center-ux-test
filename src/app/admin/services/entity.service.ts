import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';
import { AuthenticationService } from '@app/security/services';
import { EntityQuery } from '@app/threat-center/shared/models/types';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { EntityRequestInput, EntityUpdateRequestInput } from '../entity/entity.class';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private coreGraphQLService: CoreGraphQLService) {
  }

  //get tree entity data
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
                projects {
                  edges {
                    node {
                      projectId
                      name
                      created
                      childProjects {
                        edges {
                          node {
                            projectId
                            name
                            created
                          }
                        }
                      }
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
                            childProjects {
                              edges {
                                node {
                                  projectId
                                  name
                                  created
                                }
                              }
                            }
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
            }
          `, 'no-cache');
  }

  //create entitu server call
  createEntity(entityReqPayload: { entityName: string, entityType: string, parentEntityId: string }) {
    const entityRequest = EntityRequestInput.from(entityReqPayload);
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation createEntity($entity: EntityRequestInput){
        createEntity(entity: $entity){
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
                childProjects {
                  edges {
                    node {
                      projectId
                      name
                      created
                    }
                  }
                }
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
                      childProjects {
                        edges {
                          node {
                            projectId
                            name
                            created
                          }
                        }
                      }
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
    }`, { entity: entityRequest });
  }

  //update entity server call
  updateEntity(entityReqPayload: { entityId: string, entityName: string, entityType: string }) {
    const entityRequest = EntityUpdateRequestInput.from(entityReqPayload);
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation updateEntity($entity: EntityRequestInput){
        updateEntity(entity: $entity){
          entityId
          parentEntityId
          name
          entityType
          removed
        }
      }`, { entity: entityRequest });
  }

  //delete entity server call
  deleteEntity(entityId: string) {
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation {
          removeEntity(entityId:"${entityId}"){
          entityId
          parentEntityId
          name
          entityType
          removed
        }
      }`);
  }

}

@Injectable({
  providedIn: 'root'
})

export class GetDefaultEntityResolver implements Resolve<Observable<any>> {
  constructor(
    private entityService: EntityService,
    private authService: AuthenticationService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    //'676d0691-4664-46b5-b2a2-67f60a9c5298'
    return this.entityService.getTreeEntity(this.authService.currentUser.defaultEntityId);
  }
}