import { Injectable } from '@angular/core';
import {
  GetNextVulnerableReleaseListQuery,
  GetStartVulnerableReleaseListQuery,
  VulnerableReleaseResponse,
  VulnerableReleaseResponseMap
} from '@app/threat-center/shared/models/types';
import { Observable } from 'rxjs';
import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class VulnerableCodeMappingService {

    static readonly COMPONENT_RELEASES_FETCH_SIZE: number = 30;

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

  getStartVulnerableReleaseList(componentId: string): Observable<VulnerableReleaseResponseMap> {
    return this.coreGraphQLService.coreGQLReq<GetStartVulnerableReleaseListQuery>(gql(`query {
            getStartVulnerableReleaseList(
                componentId: "${componentId}",
                componentReleasesFetchSize: ${VulnerableCodeMappingService.COMPONENT_RELEASES_FETCH_SIZE}
            ) {
                map
            }
        }`), 'no-cache').pipe(map(res => res.data.getStartVulnerableReleaseList.map));
  }


  getNextVulnerableReleaseList(
    nextPagingState: string, repositoryType: string, purlType: string, group: string, name: string)
    : Observable<VulnerableReleaseResponse> {

    console.log('>>>>> passed repositoryType = ', repositoryType);
    console.log('>>>>> passed purlType = ', purlType);
    console.log('>>>>> passed group = ', group);
    console.log('>>>>> passed name = ', name);

    return this.coreGraphQLService.coreGQLReq<GetNextVulnerableReleaseListQuery>(gql(`query {
            getNextVulnerableReleaseList(
                nextPagingState: "${nextPagingState}",
                repositoryType: "${repositoryType}",
                purlType: "${purlType}",
                group: "${group}",
                name: "${name}",
                componentReleasesFetchSize: ${VulnerableCodeMappingService.COMPONENT_RELEASES_FETCH_SIZE}
            ) {
                nextPagingState
                repositoryType
                purlType
                group
                name
                size
                vulnerableReleases {
                  namespace
                  name
                  version
                  type
                  purl
                  releaseDate
                  vulnerable
                  cvssV3 {
                    cveId
                    cvssV3BaseScore
                    severity
                  }
                }
            }
        }`), 'no-cache').pipe(map(res => res.data.getNextVulnerableReleaseList));
  }
}
