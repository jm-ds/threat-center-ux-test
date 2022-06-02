import { Component, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { of } from 'rxjs';

import { AuthenticationService } from '@app/security/services';

import { environment } from 'environments/environment';

// import { MOCK_SCHEMA } from './graphql-schema.mock';

@Component({
  selector: 'app-api-explorer',
  templateUrl: './api-explorer.component.html',
  styleUrls: ['./api-explorer.component.scss']
})
export class ApiExplorerComponent implements OnDestroy {
  private scriptEl: HTMLScriptElement;

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {
    this.addGraphQLExplorerScript();
  }

  private addGraphQLExplorerScript() {
    const headEl = document.querySelector('head');

    this.scriptEl = document.createElement('script');

    const options: AddEventListenerOptions = {
      once: true
    };

    this.scriptEl.addEventListener('load', () => {
      this.initGraphQLExplorer();
    }, options);

    this.scriptEl.src = 'https://embeddable-explorer.cdn.apollographql.com/_latest/embeddable-explorer.umd.production.min.js';

    headEl.append(this.scriptEl);
  }

  private initGraphQLExplorer() {
    const headers = new HttpHeaders();
    const token = this.authenticationService.getFromSessionStorageBasedEnv('jwt');

    headers.set('Authorization', `Bearer ${token}`);

    const options = {
      headers,
      responseType: 'text' as any
    };

    /* uncomment `of(MOCK_SCHEMA)` and its imports in development mode */
    // of(MOCK_SCHEMA)
    this.httpClient
      .get<string>(`${environment.apiUrl}/rest/graphql/graphql_schema`, options)
      .subscribe(schema => {
        console.warn(`ApiExplorerComponent#initGraphQLExplorer schema: ${schema}`);

        const graphQLOptions = {
          target: '#embedded-explorer',
          endpointUrl: `${environment.apiUrl}/graphql`,
          schema,
          headers: {
            Authorization: `Bearer ${token}`
          },
          initialState: {
            document: `query Permissions {
  permissions {
    description
    name
    title
  }
}`,
            displayOptions: {
              showHeadersAndEnvVars: false,
              docsPanelState: 'open',
              theme: 'dark'
            }
          },
          handleRequest: (endpointURL: string, requestOptions: any) => fetch(endpointURL, {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              Authorization: `Bearer ${token}`
            }
          })
        };

        // tslint:disable-next-line: no-unused-expression
        new (window as any).EmbeddedExplorer(graphQLOptions);
      });
  }

  ngOnDestroy() {
    this.scriptEl.remove();
  }
}
