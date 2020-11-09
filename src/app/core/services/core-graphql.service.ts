import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult, OperationVariables, WatchQueryFetchPolicy } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreHelperService } from './core-helper.service';

@Injectable({
    providedIn: 'root'
})

export class CoreGraphQLService {
    constructor(private apollo: Apollo,
        private coreHelperService: CoreHelperService) { }


    // Core graphQL service    
    coreGQLReq<T>(

        query: DocumentNode,
        fetchPolicy?: WatchQueryFetchPolicy,
        variable: OperationVariables = {}
    ):
        Observable<ApolloQueryResult<T>> {
        return this.apollo.watchQuery<T>({
            query: query,
            fetchPolicy: fetchPolicy,
            variables: variable
        })
            .valueChanges
            .pipe(
                map((result) => {
                    return <ApolloQueryResult<T>>result;
                }),
                catchError(this.errorHandler));
    }

    coreGQLReqWithQuery<T>(
        query: DocumentNode,
        fetchPolicy?: WatchQueryFetchPolicy,
        variable: OperationVariables = {}
    ):
        Observable<ApolloQueryResult<T>> {
        return this.apollo.query<T>({
            query: query,
            // fetchPolicy: fetchPolicy,
            variables: variable
        })
            .pipe(
                map((result) => {
                    return <ApolloQueryResult<T>>result;
                }),
                catchError(this.errorHandler));
    }

    // Handle errors
    private errorHandler = (error: HttpErrorResponse | any) => {
        if (typeof error === "object") {
            let er = JSON.parse(JSON.stringify(error));
            this.coreHelperService.swalALertBox(er.message);
        } else if (typeof error === "string") {
            this.coreHelperService.swalALertBox(error);
        } else {
            this.coreHelperService.swalALertBox("Something went wrong!");
        }
        // Two way to return Observable<unknown>
        return EMPTY;
    }
}
