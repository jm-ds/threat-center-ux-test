import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {

    constructor(private apollo: Apollo, private http: HttpClient) { }

    // https://github.com/threatrix/threat-center-ux/issues/6
    //  we need to use the repositoryUrl(from the server)
    fetchAsset(repositoryOwner: string, repositoryName: string, assetId: string) {
        return this.http.get<any>(`https://api.github.com/repos/${repositoryOwner}/${repositoryName}/git/blobs/${assetId}`);
    }

    // https://github.com/threatrix/threat-center-ux/issues/6
    // we need to use the repositoryUrl(from the server)
    fetchAuthenticatedAsset(repositoryOwner: string, repositoryName: string, assetId: string, accountToken: string) {
        const headers = { 'Authorization': `Bearer ${accountToken}` };
        return this.http.get<any>(`https://api.github.com/repos/${repositoryOwner}/${repositoryName}/git/blobs/${assetId}`, { headers });
    }
}
