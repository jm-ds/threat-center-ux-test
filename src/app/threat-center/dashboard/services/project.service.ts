import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';
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
    getProject(projectId: string) {
        return this.coreGraphQLService.coreGQLReqWithQuery<ProjectQuery>(gql`
            query {
                project(projectId:"${projectId}") {
                  projectId,
                  entityId,
                  name,
                  scans {
                    totalCount
                    edges {
                      node {
                        scanId,
                        projectId,
                        branch,
                        tag,
                        version
                        created,
                        errorMsg,
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
          `, 'no-cache');
    }

    //Get Scan Vulnerabilities
    getScanVulnerabilities(scanId: string,defaultPage) {
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
    getScanComponents(scanId: string,defaultPage) {
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
    getScanLicenses(scanId: string,defaultPage) {
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
    getScanAssets(scanId: string,defaultPage) {
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
    `,'no-cache');
    }
}


@Injectable({
    providedIn: 'root'
})

export class GetProjectData implements Resolve<Observable<any>> {
    constructor(
        private projectDashboardService: ProjectDashboardService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        let projectId = route.paramMap.get('projectId');
        return this.projectDashboardService.getProject(projectId);
    }
}

@Injectable({
    providedIn: 'root'
})

export class ProjectDashboardResolver implements Resolve<Observable<any>> {
    constructor(
        private projectDashboardService: ProjectDashboardService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        let projectId = route.paramMap.get('projectId');
        return this.projectDashboardService.getProject(projectId)
            .pipe(
                mergeMap((data: any) => {
                    if (!!data.data.project.scans.edges[0]) {
                        const res1 = this.projectDashboardService.getScanVulnerabilities(data.data.project.scans.edges[0].node.scanId,25);
                        const res2 = this.projectDashboardService.getScanComponents(data.data.project.scans.edges[0].node.scanId,25);
                        const res3 = this.projectDashboardService.getScanLicenses(data.data.project.scans.edges[0].node.scanId,25);
                        const res4 = this.projectDashboardService.getScanAssets(data.data.project.scans.edges[0].node.scanId,25);
                        return forkJoin([res1, res2, res3, res4]);
                    } else {
                        return EMPTY;
                    }
                })
            );

    }
}