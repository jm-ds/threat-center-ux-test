import { Injectable } from "@angular/core";
import {
  NextVulnerabilitiesWithCvssV3Query,
  StartVulnerabilitiesWithCvssV3Query,
  VulnerableReleaseResponse,
  VulnerableReleaseResponseMap
} from '@app/threat-center/shared/models/types'
import { Observable } from "rxjs";
import { CoreGraphQLService } from '@app/services/core/core-graphql.service'
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class VulnerableCodeMappingService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    startVulnerabilitiesWithCvssV3(componentId: string): Observable<VulnerableReleaseResponseMap> {
        return this.coreGraphQLService.coreGQLReq<StartVulnerabilitiesWithCvssV3Query>(gql(`query {
            startVulnerabilitiesWithCvssV3(
                componentId: "${componentId}"
            )
        }`), 'no-cache').pipe(map(res => res.data.startVulnerabilitiesWithCvssV3));
    }


    nextVulnerabilitiesWithCvssV3(
      nextPagingState: string, repositoryType: string, purlType: string, group: string, name: string)
      : Observable<VulnerableReleaseResponse> {

        console.log('>>>>> passed repositoryType = ', repositoryType);
        console.log('>>>>> passed purlType = ', purlType);
        console.log('>>>>> passed group = ', group);
        console.log('>>>>> passed name = ', name);

        return this.coreGraphQLService.coreGQLReq<NextVulnerabilitiesWithCvssV3Query>(gql(`query {
            nextVulnerabilitiesWithCvssV3(
                nextPagingState: "${nextPagingState}",
                repositoryType: "${repositoryType}",
                purlType: "${purlType}",
                group: "${group}",
                name: "${name}"
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
        }`), 'no-cache').pipe(map(res => res.data.nextVulnerabilitiesWithCvssV3));
    }
}
