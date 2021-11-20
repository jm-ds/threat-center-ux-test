import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Messages } from "@app/messages/messages";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult, FetchPolicy, OperationVariables, WatchQueryFetchPolicy } from "apollo-client";
import { FetchResult } from "apollo-link";
import { DocumentNode } from "graphql";
import { NgxSpinnerService } from "ngx-spinner";
import { EMPTY, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CoreHelperService } from "@app/services/core/core-helper.service";
import { CoreErrorHelperService } from "@app/services/core/core-error-helper.service";
import { AlertService } from "@app/services/core/alert.service";

@Injectable({
    providedIn: 'root'
})

export class CoreGraphQLService {
    constructor(private apollo: Apollo,
        private coreHelperService: CoreHelperService,
        private spinner: NgxSpinnerService,
        private coreErrorHelperService: CoreErrorHelperService,
        private alertService:AlertService
    ) { }


    // Core graphQL service
    coreGQLReq<T>(

        query: DocumentNode,
        fetchPolicy?: WatchQueryFetchPolicy,
        variable: OperationVariables = {},
        errorHandler: any = undefined
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
                catchError(!!errorHandler? errorHandler: this.errorHandler));
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
    public errorHandler = (error: HttpErrorResponse | any) => {
        console.log("CoreGraphQLService.errorHandler:");
        console.log("ERROR:");
        console.log(error);
        this.spinner.hide();
        //Check if error is Object
        if (typeof error === "object") {
            let er = JSON.parse(JSON.stringify(error));
            if (!!er.networkError) {
                this.coreErrorHelperService.handleNetworkError(er.networkError, null);
            } else {
                this.coreErrorHelperService.printErrorMessageToConsol(er.message);

                if(Array.isArray(er.graphQLErrors)) {
                    let msg = "";
                    er.graphQLErrors.forEach(function(element, index) {
                        if(index > 0)
                            msg += "<br/>";
                        msg += element.message;
                    });
                    this.alertService.alertBoxHtml(msg);
                } else {
                    this.alertService.alertBox(Messages.graphQlCommonErrorMessage,Messages.commonErrorHeaderText,'error');
                }
            }
        } else if (typeof error === "string") { //check if error is string
            this.coreErrorHelperService.printErrorMessageToConsol(error);
            this.alertService.alertBox(error || Messages.graphQlCommonErrorMessage, Messages.commonErrorHeaderText, 'error');
        } else {
            this.alertService.alertBox(Messages.wrongMessage, Messages.commonErrorHeaderText, 'error');
        }
        return EMPTY;
    }
}
