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

    //Get Vulnerabilities by scan
    getScanVulnerabilities(scanId: string) {
        return this.coreGraphQLService.coreGQLReqWithQuery<Scan>(gql`
            query {
              scan(scanId:"${scanId}") {
                scanId,
                components {
                  totalCount
                }
              }
            }
          `);
    }

    //Get components
    getScanComponents(scanId: string) {
        return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
              query {
                scan(scanId:"${scanId}") {
                  scanId,
                  components {
                    totalCount
                  }
                }
              }
          `);
    }

    //get License
    getScanLicenses(scanId: string) {
        return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
             query {
                scan(scanId:"${scanId}") {
                  scanId,
                  licenses {
                    totalCount
                  }
                }
              }
          `);
    }

    //get assets
    getScanAssets(scanId: string) {
        return this.coreGraphQLService.coreGQLReqWithQuery<ScanQuery>(gql`
            query {
                 scan(scanId:"${scanId}") {
                scanId
                scanAssets {
                  totalCount
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
                        const res1 = this.projectDashboardService.getScanVulnerabilities(data.data.project.scans.edges[0].node.scanId);
                        const res2 = this.projectDashboardService.getScanComponents(data.data.project.scans.edges[0].node.scanId);
                        const res3 = this.projectDashboardService.getScanLicenses(data.data.project.scans.edges[0].node.scanId);
                        const res4 = this.projectDashboardService.getScanAssets(data.data.project.scans.edges[0].node.scanId);
                        return forkJoin([res1, res2, res3, res4]);
                    } else {
                        return EMPTY;
                    }
                })
            );

    }
}