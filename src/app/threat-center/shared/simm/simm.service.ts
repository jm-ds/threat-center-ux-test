import { Injectable } from '@angular/core';
import { SimmQuery, UserQuery } from "@app/models";
import gql from "graphql-tag";
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';


@Injectable({
    providedIn: 'root'
})
export class SimmService {

    constructor(private coreGraphQLService: CoreGraphQLService) {
    }

    compare(sourceContent: string, matchContent: string) {

        return this.coreGraphQLService.coreGQLReq(gql`query($sourceContent: String, $matchContent: String) {
            simmCompare(sourceContent: $sourceContent, matchContent: $matchContent) {
                leftStart, leftEnd, rightStart, rightEnd
            }
        }`, 'no-cache', { sourceContent: sourceContent, matchContent: matchContent });
    }

}
