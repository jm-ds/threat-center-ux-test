import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { Injectable } from "@angular/core";

import { HttpHeaders, HttpParams } from "@angular/common/http";
import { CoreHttpService } from "@app/core/services/core-http.service";
import { VulnerableReleaseResponseMap, VulnerableReleaseResponse } from "@app/threat-center/shared/models/types";

@Injectable({
    providedIn: 'root'
})
export class VulnerableCodeMappingService {

    constructor(private coreHttpService: CoreHttpService) {
    }

    startVulnerabilitiesWithCvssV3(componentId: string): Observable<VulnerableReleaseResponseMap> {

        console.log('>>>>> passed componentId = ', componentId);
        const url = environment.apiUrl + '/startVulnerabilitiesWithCvssV3';
        const params = new HttpParams()
            .set('componentId', componentId);
        console.log('>>>>> param componentId = ', params.get('componentId'));

        return this.coreHttpService.httpGetWithParamsRequest<VulnerableReleaseResponseMap>(url, new HttpHeaders(), params).pipe();
    }

    nextVulnerabilitiesWithCvssV3(nextPagingState: string, repositoryType: string, purlType: string, group: string, name: string): Observable<VulnerableReleaseResponse> {

        console.log('>>>>> passed repositoryType = ', repositoryType);
        console.log('>>>>> passed purlType = ', purlType);
        console.log('>>>>> passed group = ', group);
        console.log('>>>>> passed name = ', name);

        const url = environment.apiUrl + '/nextVulnerabilitiesWithCvssV3';
        const params = new HttpParams()
            .set('repositoryType', repositoryType)
            .set('purlType', purlType)
            .set('group', group)
            .set('name', name)
            .set('nextPagingState', nextPagingState);

        console.log('>>>>> param nextPagingState = ', params.get('nextPagingState'));

        return this.coreHttpService.httpGetWithParamsRequest<VulnerableReleaseResponse>(url, new HttpHeaders(), params).pipe();
    }
}
