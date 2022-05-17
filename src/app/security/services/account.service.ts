import { Injectable } from '@angular/core';
import {
  AccountCreateMutation,
  AccountUpdateMutation,
  AccountUpdateRequest,
  AuthenticationResponse,
  FormAccountRequest,
  GetUserQuery,
  User
} from '@app/models';
import { LocalService } from '@app/services/core/local.service';
import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { AuthenticationService } from '@app/security/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(private coreGraphQLService: CoreGraphQLService,
              private localService: LocalService,
              private authService: AuthenticationService,
              private cookieService: CookieService) {
  }

  loadAuthenticatedUser(): Observable<User> {
    return this.coreGraphQLService.coreGQLReq<GetUserQuery>(gql(`query {
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
    ), 'no-cache').pipe(map((res: ApolloQueryResult<GetUserQuery>) => {
      this.authService.setInSessionStorageBasedEnv('currentUser', res.data.getUser);
      return res.data.getUser;
    }));
  }

  createAccount(email: string, fullName: string, phone: string, password: string,
                companyName: string, position: string, coverLetter: string, inviteHash: string): Observable<AuthenticationResponse> {
    const formAccountRequest = new FormAccountRequest(email, fullName, phone, password, companyName, position, coverLetter, inviteHash);
    return this.coreGraphQLService.coreGQLReqForMutation<AccountCreateMutation>(gql(
      `mutation NewAccountMutation($formAccountRequest: FormAccountRequestInput) {
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
    }`), {formAccountRequest})
      .pipe(map(res => {
        this.authService.setInSessionStorageBasedEnv('jwt', res.data.createAccount.jwt);
        this.authService.setInSessionStorageBasedEnv('currentUser', res.data.createAccount.user);
        this.cookieService.delete('invite');
        return res.data.createAccount;
      }, (err) => {
        console.error('AUTH SERVICE ERROR:', err);
      }));
  }

  updateAccount(accountUpdateRequest: AccountUpdateRequest) {
    return this.coreGraphQLService.coreGQLReqForMutation<AccountUpdateMutation>(gql(
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
    ), {accountUpdateRequest})
      .pipe(map(res => {
        console.log(res);
        return res.data.updateAccount;
      }));
  }
}
