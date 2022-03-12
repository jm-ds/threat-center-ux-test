import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {EntityQuery, FixResult} from "@app/models";
import {PatchedInfo, PatchedInfoSimplified, PatchedInfoSimplifiedQuery} from "@app/threat-center/shared/models/types";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {CoreGraphQLService} from "@app/services/core/core-graphql.service";

@Injectable({
    providedIn: 'root'
})
export class FixService {

    constructor(
        private http: HttpClient,
        private coreGraphQLService: CoreGraphQLService
    ) {}


    fixComponentVersion(scanId: string, componentId: string, oldVersion: string, newVersion: string): Observable<FixResult[]> {
        const url = environment.apiUrl + '/fixComponentVersion';
        const body = new FormData();

        body.append('scanId', scanId);
        body.append('componentId', componentId);
        body.append('newVersion', newVersion);
        body.append('oldVersion', oldVersion);
        return this.http.post<FixResult[]>(url, body).pipe();
    }

    getPatchedVersion(componentId: string): Observable<PatchedInfoSimplified> {
        // todo: ref: Why do we have to call gql() each time? Make coreGQLReq accept string as first arg and call gql() inside coreGQLReq. [task: https://github.com/threatrix/product/issues/1225]
        return this.coreGraphQLService.coreGQLReq<PatchedInfoSimplifiedQuery>(gql(`query {
            autofixVersions(componentId: "${componentId}") {
                namespace
                name
                vulnerableVersion
                cveId
                nextPatchedVersion
                latestPatchedVersion
            }
        }`), 'no-cache').pipe(map(result => result.data.autofixVersions));
    }


}
