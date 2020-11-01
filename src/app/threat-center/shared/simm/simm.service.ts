import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {UserQuery} from "@app/models";
import gql from "graphql-tag";
import {SimmQuery} from "@app/threat-center/shared/models/types";

@Injectable({
    providedIn: 'root'
})
export class SimmService {

    constructor(private apollo: Apollo) {
    }

    compare(sourceContent: string, matchContent: string) {
        return this.apollo.watchQuery<SimmQuery>({
            query: gql`query($sourceContent: String, $matchContent: String) {
                simmCompare(sourceContent: $sourceContent, matchContent: $matchContent) {
                    leftStart, leftEnd, rightStart, rightEnd
                }
            }`,
            variables: {
                sourceContent: sourceContent,
                matchContent: matchContent
            }
        }).valueChanges;
    }

}
