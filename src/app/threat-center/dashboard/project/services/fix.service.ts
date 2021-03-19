import {HttpClient, HttpParams} from "@angular/common/http";
import {FixResult, PatchedInfo} from "@app/threat-center/shared/models/types";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {Injectable} from "@angular/core";
import { FixResult } from "@app/models";

@Injectable({
    providedIn: 'root'
})
export class FixService {
    constructor(private http: HttpClient) {

    }

    fixComponentVersion(scanId: string, componentId: string,  oldVersion: string, newVersion: string): Observable<FixResult[]> {
        const url = environment.apiUrl + '/fixComponentVersion';
        const body = new FormData();

        body.append('scanId', scanId);
        body.append('componentId', componentId);
        body.append('newVersion', newVersion);
        body.append('oldVersion', oldVersion);
        return this.http.post<FixResult[]>(url, body).pipe();
    }

    getPatchedVersion(componentId: string): Observable<PatchedInfo> {
        const url = environment.apiUrl + '/patchedInfoForAllById';
        const opts = { params: new HttpParams().set('componentId', componentId) };
        return this.http.get<PatchedInfo>(url, opts).pipe();
    }
}
