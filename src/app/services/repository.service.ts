import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {

    constructor(private apollo: Apollo, private http: HttpClient) { }

    fetchAsset(url: string) {
        return this.http.get<any>(url);
    }

    fetchAuthenticatedAsset(url: string, accountToken: string) {
        const headers = { 'Authorization': `Bearer ${accountToken}` };
        return this.http.get<any>(url, { headers });
    }
}
