import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/services/core/core-graphql.service";
import { SimmQuery } from "@app/models";
import gql from "graphql-tag";


@Injectable({
    providedIn: 'root'
})
export class SimmService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    compare(sourceContent: string, matchContent: string) {

        return this.coreGraphQLService.coreGQLReq<SimmQuery>(gql`query($sourceContent: String, $matchContent: String) {
            simmCompare(sourceContent: $sourceContent, matchContent: $matchContent) {
                leftStart, leftEnd, rightStart, rightEnd
            }
        }`, 'no-cache', { sourceContent: sourceContent, matchContent: matchContent });
    }
}
