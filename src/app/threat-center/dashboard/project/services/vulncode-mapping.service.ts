import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { Injectable } from "@angular/core";

import { HttpHeaders, HttpParams } from "@angular/common/http";
import { CoreHttpService } from "@app/core/services/core-http.service";
import { VulnerableRelease } from "@app/threat-center/shared/models/types";

@Injectable({
    providedIn: 'root'
})
export class VulnerableCodeMappingService {

    constructor(private coreHttpService: CoreHttpService) {
    }

    vulnerabilitiesWithCvssV3(componentId: string): Observable<VulnerableRelease[]> {

        console.log('>>>>> passed componentId = ', componentId);
        const url = environment.apiUrl + '/vulnerabilitiesWithCvssV3';
        const params = new HttpParams()
            .set('componentId', componentId);
        console.log('>>>>> param componentId = ', params.get('componentId'));

        return this.coreHttpService.httpGetWithParamsRequest<VulnerableRelease[]>(url, new HttpHeaders(), params).pipe();
    }
}
