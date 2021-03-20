import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult, FetchPolicy, OperationVariables, WatchQueryFetchPolicy } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreHelperService } from './core-helper.service';
import { FetchResult } from 'apollo-link';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '@app/security/services';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class CoreGraphQLService {
    constructor(private apollo: Apollo,
        private coreHelperService: CoreHelperService,
        private spinner: NgxSpinnerService,
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }


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
        fetchPolicyss?: FetchPolicy,
        variable: OperationVariables = {}
    ):
        Observable<ApolloQueryResult<T>> {
        return this.apollo.query<T>({
            query: query,
            fetchPolicy: fetchPolicyss,
            variables: variable
        })
            .pipe(
                map((result) => {
                    return <ApolloQueryResult<T>>result;
                }),
                catchError(this.errorHandler));
    }


    coreGQLReqForMutation<T>(
        mutationQ: DocumentNode,
        variable: OperationVariables = {}
    ): Observable<FetchResult<T>> {
        return this.apollo.mutate<T>({
            mutation: mutationQ,
            variables: variable
        })
            .pipe(
                map((result) => {
                    return <FetchResult<T>>result;
                }),
                catchError(this.errorHandler));
    }

    // Handle errors
    /*
        todo: https://github.com/threatrix/product/issues/400
            there are some todos in the method belo to point issues related to #400 task
     */
    private errorHandler = (error: HttpErrorResponse | any) => {
        console.log("CoreGraphQLService.errorHandler:");
        console.log("ERROR:");
        console.log(error);
        this.spinner.hide();
        if (typeof error === "object") {
            let er = JSON.parse(JSON.stringify(error));
            // todo: put error printing to console in single place
            console.log(er.message);
            if (!!er.networkError) {
                // todo: put error printing to console in single place
                console.log(er.networkError);
                if (er.networkError.status === 403) {
                    const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                    if (!!jwt) {
                        if (this.authenticationService.isTokenExpired(jwt)) {
                            this.authenticationService.logout();
                            this.router.navigate(['/login']);
                            // todo: SILENT REDIRECT
                        } else {
                            // todo: READ SERVER MESSAGE for alert called next line
                            this.coreHelperService.swalALertBox(this.coreHelperService.getMessageStatusWise(er.networkError.status), er.networkError.status);
                        }
                    }
                    // todo: DEAD END
                } else {
                    this.coreHelperService.swalALertBox(this.coreHelperService.getMessageStatusWise(er.networkError.status), er.networkError.status);
                    if (er.networkError.status === 401) {
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                        // todo: SILENT REDIRECT
                    }
                }
            } else {
                this.coreHelperService.swalALertBox(er.message);
            }
        } else if (typeof error === "string") {
            // todo: put error printing to console in single place
            console.log(error);
            this.coreHelperService.swalALertBox(error);
        } else {
            this.coreHelperService.swalALertBox("Something went wrong!");
        }
        // Two way to return Observable<unknown>
        return EMPTY;
    }
}
