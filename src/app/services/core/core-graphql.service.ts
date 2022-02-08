import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import { ApolloQueryResult, FetchPolicy, OperationVariables, WatchQueryFetchPolicy } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { DocumentNode } from 'graphql';

import { MESSAGES } from '@app/messages/messages';

import { CoreErrorHelperService } from '@app/services/core/core-error-helper.service';
import { AlertService } from '@app/services/core/alert.service';

@Injectable({
  providedIn: 'root'
})

export class CoreGraphQLService {
  constructor(private apollo: Apollo, private coreErrorHelperService: CoreErrorHelperService, private alertService: AlertService) { }

  /** Core GraphQL service */
  coreGQLReq<T>(
    query: DocumentNode,
    fetchPolicy?: WatchQueryFetchPolicy,
    variables: OperationVariables = {},
    errorHandler?: any
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo
      .watchQuery<T>({ query, fetchPolicy, variables })
      .valueChanges
      .pipe(
        map(result => result as ApolloQueryResult<T>),
        catchError(
          errorHandler
            ? errorHandler
            : this.errorHandler.bind(this, 'CoreGraphQLService#coreGQLReq')
        )
      );
  }

  coreGQLReqWithQuery<T>(
    query: DocumentNode,
    fetchPolicy?: FetchPolicy,
    variables: OperationVariables = {}
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo
      .query<T>({ query, fetchPolicy, variables })
      .pipe(
        map(result => result as ApolloQueryResult<T>),
        catchError(
          this.errorHandler.bind(this, 'CoreGraphQLService#coreGQLReqWithQuery')
        )
      );
  }

  coreGQLReqForMutation<T>(mutation: DocumentNode, variables: OperationVariables = {}): Observable<FetchResult<T>> {
    return this.apollo
      .mutate<T>({ mutation, variables })
      .pipe(
        map(result => result as FetchResult<T>),
        catchError(
          this.errorHandler.bind(this, 'CoreGraphQLService#coreGQLReqForMutation')
        )
      );
  }

  errorHandler = (errorSource: string, error: HttpErrorResponse | any, source?: Observable<any>) => {
    let consoleError: string;

    let alert: Partial<{
      title: string,
      text: string,
      hasHTML: boolean;
    }> = {
      title: MESSAGES.ERROR_TITLE
    };

    switch (typeof error) {
      // set an error from an error object
      case 'object': {
        if (!error.networkError) {
          const { message, graphQLErrors } = error;

          consoleError = message;

          if (Array.isArray(graphQLErrors)) {
            // gather an HTML alert text
            alert.hasHTML = true;

            graphQLErrors.forEach((element: any, index: any) => {
              if (index > 0) {
                alert.text += '<br>';
              }

              alert.text += element.message;
            });
          } else {
            alert.text = MESSAGES.GRAPHQL_ERROR_MESSAGE;
          }
        }

        break;
      }

      // set an error from an error string
      case 'string': {
        consoleError = error;
        alert.text = error || MESSAGES.GRAPHQL_ERROR_MESSAGE;

        break;
      }

      default:
        alert.text = MESSAGES.ERROR_MESSAGE;
    }

    return this.coreErrorHelperService.errorHandler(errorSource, undefined, consoleError, alert, error, source);
  }
}
