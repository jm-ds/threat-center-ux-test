import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FixComponentVersionQuery, FixResult } from '@app/models';
import { PatchedInfoSimplified, PatchedInfoSimplifiedQuery } from '@app/threat-center/shared/models/types';
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
        return this.coreGraphQLService.coreGQLReq<FixComponentVersionQuery>(gql(`query {
            fixComponentVersion(
                scanId: "${scanId}", componentId: "${componentId}", newVersion: "${newVersion}", oldVersion:"${oldVersion}"
            ) {
                groupId
                artifactId
                oldVersion
                newVersion
                buildFile
                success
                errorMessage
            }
        }`), 'no-cache').pipe(map(res => res.data.fixComponentVersion));
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
