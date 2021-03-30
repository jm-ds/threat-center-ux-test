import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { NextConfig } from '@app/app-config';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { ProjectQuery, Scan, ScanQuery } from '@app/threat-center/shared/models/types';
import gql from 'graphql-tag';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ProjectDashboardService {
  constructor(private coreGraphQLService: CoreGraphQLService) {
  }

  //Get Project Data
  getProject(projectId: string, first) {
    return this.coreGraphQLService.coreGQLReqWithQuery<ProjectQuery>(gql`
            query {
                project(projectId:"${projectId}") {
                  projectId,
                  entityId,
                  name,
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
                        created,
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

  getAllScanData(scanId: string, defaultPage, scanAssetDetails: any) {

    //Scan Asset Config Start
    let parentId = (scanAssetDetails.parentScanAssetId.length > 0) ? 'parentScanAssetId: \"' + scanAssetDetails.parentScanAssetId + '\", ' : "";
    let filterArg = 'filter: \"' + scanAssetDetails.filter + '\"';
    const firstArg = (!!scanAssetDetails.first) ? `first: ${scanAssetDetails.first}` : '';
    //Scan Asset Config End

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

                scanAssetsTree(${parentId}${filterArg}${firstArg}) {
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

  //Get Scan Vulnerabilities
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

  //get assets
  getScanAssets(scanId: string, defaultPage) {
    return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
      query {
         scan(scanId:"${scanId}") {
          scanId
          scanAssets(first:${defaultPage}) {
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
}


@Injectable({
  providedIn: 'root'
})

export class GetProjectData implements Resolve<Observable<any>> {
  constructor(
    private projectDashboardService: ProjectDashboardService,
    private coreHelperService: CoreHelperService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let projectId = route.paramMap.get('projectId');
    return this.projectDashboardService.getProject(projectId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")));
  }
}

@Injectable({
  providedIn: 'root'
})

export class ProjectDashboardResolver implements Resolve<Observable<any>> {
  constructor(
    private projectDashboardService: ProjectDashboardService,
    private coreHelperService: CoreHelperService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let projectId = route.paramMap.get('projectId');
    return this.projectDashboardService.getProject(projectId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Scan")))
      .pipe(
        mergeMap((data: any) => {
          if (!!data.data.project && !!data.data.project.scans.edges[0]) {
            const res1 = this.projectDashboardService.getAllScanData(data.data.project.scans.edges[0].node.scanId, NextConfig.config.defaultItemPerPage, { parentScanAssetId: '', filter: '', first: Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")) });
            return forkJoin([res1]);
          } else {
            this.coreHelperService.swalALertBox("Project data not found!");
            return EMPTY;
          }
        })
      );

  }
}
