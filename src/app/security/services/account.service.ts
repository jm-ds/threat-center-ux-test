import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';

import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import { AuthenticationService } from '@app/security/services/authentication.service';

import {
  AccountCreateMutation,
  AccountUpdateMutation,
  AccountUpdateRequest,
  AuthenticationResponse,
  FormAccountRequest,
  GetUserQuery,
  User
} from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private coreGraphQLService: CoreGraphQLService,
    private authService: AuthenticationService,
    private cookieService: CookieService
  ) { }

  loadAuthenticatedUser(): Observable<User> {
    return this.coreGraphQLService
      .coreGQLReq<GetUserQuery>(gql(`query {
  getUser {
    orgId,
    username,
    created,
    email,
    fname,
    lname,
    phone,
    position
    accessToken,
    approved,
    coverLetter
    defaultEntityId,
    avatarUrl,
    invitedByUsername
    repositoryAccounts {
      githubAccount {
        accessToken,
        scopes,
        accountName
      }
      gitlabAccount {
        accessToken,
        scopes,
        accountName
      }
      bitbucketAccount {
        accessToken,
        scopes,
        accountName
      }
    }
    organization {
      name,
      created,
      orgId
    }
    roles {
      roleId,
      description,
      permissions,
      rolePermissions {
        name,
        title,
        description
      }
    }
    permissions
    authorities {
      authority
    }
  }
      }`), 'no-cache')
      .pipe(
        map((response: ApolloQueryResult<GetUserQuery>) => {
          this.authService.setCurrentUser(response.data.getUser);

          return response.data.getUser;
        })
      );
  }

  createAccount(email: string, fullName: string, phone: string, password: string,
                companyName: string, position: string, coverLetter: string, inviteHash: string): Observable<AuthenticationResponse> {
    const formAccountRequest = new FormAccountRequest(email, fullName, phone, password, companyName, position, coverLetter, inviteHash);
    return this.coreGraphQLService
      .coreGQLReqForMutation<AccountCreateMutation>(gql(`mutation NewAccountMutation($formAccountRequest: FormAccountRequestInput) {
  createAccount(formAccountRequest: $formAccountRequest) {
    jwt,
    user {
        username,
        enabled,
        credentialsNonExpired,
        accountNonExpired,
        accountNonLocked
    }
  }
      }`), { formAccountRequest })
      .pipe(
        map(
          response => {
            this.authService.setInSessionStorageBasedEnv('jwt', response.data.createAccount.jwt);
            this.authService.setCurrentUser(response.data.createAccount.user);
            this.cookieService.delete('invite');

            return response.data.createAccount;
          },
          (error: any) => {
            console.error(`AUTH SERVICE ERROR: ${error}`);
          }
        )
      );
  }

  updateAccount(accountUpdateRequest: AccountUpdateRequest) {
    return this.coreGraphQLService
      .coreGQLReqForMutation<AccountUpdateMutation>(gql(
      `mutation UpdateAccountMutation($accountUpdateRequest: AccountUpdateRequestInput) {
  updateAccount(accountUpdateRequest: $accountUpdateRequest) {
    orgId,
    username,
    created,
    email,
    fname,
    lname,
    phone,
    position
    accessToken,
    approved,
    coverLetter
    defaultEntityId,
    avatarUrl,
    invitedByUsername
    repositoryAccounts {
      githubAccount {
        accessToken,
        scopes
      }
      gitlabAccount {
        accessToken,
        scopes
      }
      bitbucketAccount {
        accessToken,
        scopes
      }
    }
    organization {
      name,
      created,
      orgId
    }
    roles {
      roleId,
      description,
      permissions,
      rolePermissions {
        name,
        title,
        description
      }
    }
    permissions
    authorities {
      authority
    }
  }
      }`
    ), { accountUpdateRequest })
      .pipe(
        map(response => {
          console.log(response);

          return response.data.updateAccount;
        })
      );
  }
}
