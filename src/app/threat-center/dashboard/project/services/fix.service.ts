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

    fixComponentVersion(scanId: string, groupId: string, artifactId: string, newVersion: string): Observable<FixResult> {
        const url = environment.apiUrl + '/fixMvnDepVersion';
        const body = new FormData();

        body.append('scanId', scanId);
        body.append('groupId', groupId);
        body.append('artifactId', artifactId);
        body.append('newVersion', newVersion);
        return this.http.post<any>(url, body).pipe();
    }
}