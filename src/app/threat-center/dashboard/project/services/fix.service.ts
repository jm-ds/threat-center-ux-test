import {HttpClient} from "@angular/common/http";
import {FixResult} from "@app/threat-center/shared/models/types";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {Injectable} from "@angular/core";

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
        return this.http.post<any>(url, body).pipe();
    }
}
