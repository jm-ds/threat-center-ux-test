import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult, OperationVariables, WatchQueryFetchPolicy } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class CoreGraphQLService {
    constructor(private apollo: Apollo) { }

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

    private errorHandler = (error: HttpErrorResponse | any) => {
        if (typeof error === "object") {
            let er = JSON.parse(JSON.stringify(error));
            this.swalALertBox(er.message);
        } else if (typeof error === "string") {
            this.swalALertBox(error);
        } else {
            this.swalALertBox("Something went wrong!");
        }
        // Two way to return Observable<unknown>
        return EMPTY;
    }

    swalALertBox(text: string, title: string = "Error!", type: string = "error") {
        Swal.fire({
            type: "error",
            title: "Error!",
            text: text
        });
    }
}
