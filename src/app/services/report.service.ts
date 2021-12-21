import { Injectable } from "@angular/core";
import {EntityListQuery, ScanLicenseQuery} from "@app/models";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PatchedInfo} from "@app/threat-center/shared/models/types";

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private apollo: Apollo,
        private coreGraphQLService: CoreGraphQLService,
        private http: HttpClient
    ) {
    }


    // return entity list with vulnerabilities
    getVulnerabilities2(severity, vulns) {
      const url = environment.apiUrl + '/vulnerability-state-report';
      const opts = { params: new HttpParams().set('severity', severity).set('vulns', vulns)};
      return this.http.get<any>(url, opts).pipe();
    }

    // return entity list with license
  findLicenses(name, type, category) {
      const url = environment.apiUrl + '/license-state-report';
      const opts = { params: new HttpParams().set('name', name).set('type', type).set("category", category)};
      return this.http.get<any>(url, opts).pipe();
    }

    // return entity list with license
  findComponents(nameFilter, versionFilter, typeFilter, locationFilter, discoveryFilter, isInternalFilter, hasVulnerabilitiesFilter) {
      const url = environment.apiUrl + '/component-state-report';

      let paramsVar = new HttpParams()
          .set('name', nameFilter)
          .set('version', versionFilter)
          .set("type", typeFilter)
          .set("discoveredIn", locationFilter)
          .set("discoveryType", discoveryFilter);

      if (isInternalFilter === true) {
          paramsVar = paramsVar.set("isInternal", isInternalFilter);
      }
      if (hasVulnerabilitiesFilter === true) {
          paramsVar = paramsVar.set("hasVulnerabilities", hasVulnerabilitiesFilter);
      }

      const opts = { params: paramsVar};
      return this.http.get<any>(url, opts).pipe();
    }

  findComponentsGQL(nameFilter, versionFilter, typeFilter, locationFilter, discoveryFilter, isInternalFilter, hasVulnerabilitiesFilter) {
      return this.coreGraphQLService.coreGQLReq<any>(gql`
          query {
              componentsReport(name:"${nameFilter}", version:"${versionFilter}", type:"${typeFilter}", discoveredIn:"${locationFilter}", 
                               discoveryType:"${discoveryFilter}", isInternal: ${isInternalFilter}, hasVulnerabilities: ${hasVulnerabilitiesFilter}) {
                  entityId,
                  entityName,
                  projectId,
                  projectName,
                  comps {
                      id
                      orgId
                      orgName
                      entityId
                      entityName
                      projectId
                      projectName
                      subProjectId
                      subProjectName
                      scanId
                      scanRepoId
                      scanDate
                      dateCreated
                      componentId
                      group
                      name
                      version
                      purl
                      versionRecent
                      versionFixed
                      hasVulnerability
                      classifier
                      description
                      isInternal
                      license
                      componentType
                      componentLocation
                      componentDiscoveryMethod
                      vulnerabilitiesStr
                      fixedVersions

                      licenses(first: 100) {
                          edges {
                              node {
                                  licenseId
                                  name
                                  category
                                  licenseDiscovery
                              }
                          }
                      }

                      vulns(first: 100) {
                          totalCount
                          edges {
                              node {
                                  vulnerabilityId
                                  vulnId
                                  severity
                                  patchedVersions
                              }
                          }
                      }
                  }
              }
          }
      `);
  }

    // return entity list with license
  findEmbeddedAssets(name, size, embeddedPercent, matchType) {
      const url = environment.apiUrl + '/embedded-asset-state-report';
      const opts = { params: new HttpParams()
              .set('name', name)
              .set('size', size)
              .set("embeddedPercent", embeddedPercent)
              .set("matchType", matchType)
      };
      return this.http.get<any>(url, opts).pipe();
    }

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
