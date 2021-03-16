import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
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
    `, 'no-cache');
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
            const res1 = this.projectDashboardService.getScanVulnerabilities(data.data.project.scans.edges[0].node.scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Vulnerabilities")));
            const res2 = this.projectDashboardService.getScanComponents(data.data.project.scans.edges[0].node.scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Components")));
            const res3 = this.projectDashboardService.getScanLicenses(data.data.project.scans.edges[0].node.scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Licenses")));
            const res4 = this.projectDashboardService.getScanAssets(data.data.project.scans.edges[0].node.scanId, Number(this.coreHelperService.getItemPerPageByModuleAndComponentName("Project", "Assets")));
            return forkJoin([res1, res2, res3, res4]);
          } else {
            this.coreHelperService.swalALertBox("Project data not found!");
            return EMPTY;
          }
        })
      );

  }
}
