import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/services/core-graphql.service";
import { EntityListQuery } from "@app/models";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private apollo: Apollo,
        private coreGraphQLService: CoreGraphQLService) {
    }


    // return entity list with vulnerabilities
    getVulnerabilities() {
        return this.coreGraphQLService.coreGQLReq<EntityListQuery>(gql`query {
          entities {
            edges {
              node {
                entityId,
                parentEntityId,
                name,
                entityComponents {
                  edges {
                    node {
                      componentId
                      name,
                      group,
                      version,
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
                            patchedVersions,
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
          }
        }`, 'no-cache');
    } // getVulnerabilities


    // return entity list with licenses
    getLicenses() {
        return this.coreGraphQLService.coreGQLReq<EntityListQuery>(gql`query {
          entities {
            edges {
              node {
                entityId,
                parentEntityId,
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
                            type,
                            familyName,
                            category,
                            shortName,
                            style,
                            category,
                            publicationYear
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`, 'no-cache');
    } // getLicenses


    // return entity list with components
    getComponents() {
        return this.coreGraphQLService.coreGQLReq<EntityListQuery>(gql`query {
          entities {
            edges {
              node {
                entityId,
                parentEntityId,
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
                            type,
                            familyName,
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
                            patchedVersions,
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
          }
        }`, 'no-cache');
    } // getComponents


    // return entity list with assets
    getAssets() {
        return this.coreGraphQLService.coreGQLReq<EntityListQuery>(gql`query {
          entities {
            edges {
              node {
                entityId,
                parentEntityId,
                name,
                projects {
                  edges {
                    node {
                      projectId,
                      name,
                      created,
                      latestScan {
                        scanId
                        projectId
                        branch
                        tag
                        version
                        created
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
                  }
                }
              }
            }
          }
        }`, 'no-cache');
    }

}
