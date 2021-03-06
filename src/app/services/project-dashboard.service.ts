import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { EMPTY, forkJoin, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import gql from 'graphql-tag';

import { ProjectQuery, Scan, ScanEdge, ScanQuery } from '@app/models';

import { NextConfig } from '@app/app-config';
import { MESSAGES } from '@app/messages/messages';

import { AlertService } from '@app/services/core/alert.service';
import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { UserPreferenceService } from '@app/services/core/user-preference.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardService {
  constructor(private coreGraphQLService: CoreGraphQLService) {
  }

  //Get enity Name
  getEntity(entityId) {
    return this.coreGraphQLService.coreGQLReqWithQuery<any>(gql`
    query {
      entity(entityId: "${entityId}") {
        entityId
        name
       }
    }`, `no-cache`);
  }

  //Get Project Data
  getProject(projectId: string, first) {
    return this.coreGraphQLService.coreGQLReqWithQuery<ProjectQuery>(gql`
            query {
                project(projectId:"${projectId}") {
                  projectId,
                  entityId,
                  name,
                  tags,
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
                  scans(first:${first}) {
                    totalCount
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                    edges {
                      node {
                        scanId,
                        projectId,
                        branch,
                        tag,
                        version
                        versionHash
                        created,
                        status,
                        errorMsg,
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
                             proprietary,
                             proprietaryFree,
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
                }
            }
          `, 'no-cache');
  }

  getAllScanData(scanId: string, defaultPage, scanAssetDetails: any, componentPage, vulPage, licensePage) {

    // Scan Asset Config Start
    let parentId = (scanAssetDetails.parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + scanAssetDetails.parentScanAssetId + '\", ' : "";
    let filterArg = 'filter: \"' + scanAssetDetails.filter + '\"';
    const firstArg = (!!scanAssetDetails.first) ? `first: ${scanAssetDetails.first}` : '';
    // Scan Asset Config End

    return this.coreGraphQLService.coreGQLReqWithQuery<Scan>(gql`
          query {
            scan(scanId:"${scanId}") {
                scanId,
                vulnerabilities(first:${vulPage}) {
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
                                  version,
                                  componentId
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


                components(first:${componentPage}) {
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
                            spdxId,
                            licenseDiscovery
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


                licenses(first:${licensePage}) {
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
                      trustLevel,

                    }
                  }
                }
            }
          }
      `, 'no-cache');
  }

  // Get Scan Vulnerabilities
  getScanVulnerabilities(scanId: string, defaultPage) {
    return this.coreGraphQLService.coreGQLReqWithQuery<Scan>(gql`
          query {
            scan(scanId:"${scanId}") {
                scanId,
                vulnerabilities(first:${defaultPage}) {
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
                                  version,
                                  componentId
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
      `);

  }

  //Get Scan Components
  getScanComponents(scanId: string, defaultPage) {
    return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
        query {
          scan(scanId:"${scanId}") {
            scanId,
            components(first:${defaultPage}) {
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
    `);

  }

  //get Scan License
  getScanLicenses(scanId: string, defaultPage) {
    return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
      query {
         scan(scanId:"${scanId}") {
           scanId,
           licenses(first:${defaultPage}) {
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
                 isFsfLibre
               }
             }
           }
         }
       }
   `);
  }

  // set project tags
  setProjectTags(projectId: string, tags: string[]): any {
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql` mutation { setProjectTags(projectId: "${projectId}", tags: "${tags}") {
          projectId
      }}`
    );
  }

}


@Injectable({
  providedIn: 'root'
})

export class GetProjectData implements Resolve<Observable<any>> {
  constructor(
    private projectDashboardService: ProjectDashboardService,
    private coreHelperService: CoreHelperService,
    private userPreferenceService: UserPreferenceService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let projectId = route.paramMap.get('projectId');
    return this.projectDashboardService.getProject(projectId, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName("Project", "Scan")));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardResolver implements Resolve<Observable<any>> {
  constructor(
    private projectDashboardService: ProjectDashboardService,
    private userPreferenceService: UserPreferenceService,
    private alertService: AlertService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const projectId = route.paramMap.get('projectId');

    return this.projectDashboardService
      .getProject(projectId, Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName('Project', 'Scan')))
      .pipe(
        mergeMap(data => {
          let scanEdge: ScanEdge;

          const lastScanSelected = this.userPreferenceService.getLastScanSelectedByModule('Project');

          if (lastScanSelected && lastScanSelected.lastSelectedScanId && lastScanSelected.lastSelectedScanId !== '') {
            scanEdge = data.data.project.scans.edges.find(edge => edge.node.scanId === lastScanSelected.lastSelectedScanId);
          }

          if (!scanEdge) {
            scanEdge = data.data.project.scans.edges.reduce((a, b) => a.node.created > b.node.created ? a : b);
          }

          const scanID = scanEdge.node.scanId;

          if (data.data.project && scanID) {
            const componentPage = this.userPreferenceService.getItemPerPageByModuleAndComponentName('Project', 'Components');
            const vulPage = this.userPreferenceService.getItemPerPageByModuleAndComponentName('Project', 'Vulnerabilities');
            const licensePage = this.userPreferenceService.getItemPerPageByModuleAndComponentName('Project', 'Licenses');

            const scanAssetDetails = {
              parentScanAssetId: '',
              filter: '',
              first: Number(this.userPreferenceService.getItemPerPageByModuleAndComponentName('Project', 'Assets'))
            };

            const scan$ = this.projectDashboardService.getAllScanData(
              scanID,
              NextConfig.config.defaultItemPerPage,
              scanAssetDetails,
              componentPage,
              vulPage,
              licensePage
            );

            return forkJoin([scan$]);
          } else {
            this.alertService.alertBox(MESSAGES.PROJECT_DATA_NOT_FOUND, MESSAGES.ERROR_TITLE, 'error');

            return EMPTY;
          }
        })
      );
  }
}
