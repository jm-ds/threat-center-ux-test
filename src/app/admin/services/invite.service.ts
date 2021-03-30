import { Injectable } from '@angular/core';
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';
import { AuthenticationService } from '@app/security/services';
import gql from 'graphql-tag';
import {Apollo} from "apollo-angular";
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { isUndefined } from 'util';
import { Invite, InviteMailData, InviteMailDataRequestInput, InviteQuery } from '@app/models';

@Injectable({
  providedIn: 'root'
})


export class InviteService {
  constructor(
    private coreGraphQLService: CoreGraphQLService,
    private authService: AuthenticationService,
    private apollo: Apollo
    ) {}


  // creates invite  
  createInvite(): any {
    if (!this.authService.currentUser || !this.authService.currentUser.orgId) {
      Swal.fire('Not Found', 'Organization not found!', 'error');
      return undefined;
    } else {
      return this.apollo.mutate<InviteQuery>({
        mutation: gql`mutation {
          createInvite(orgId: "${this.authService.currentUser.orgId}") {
                orgId,
                username,
                inviteHash,
                expiredDate,
                inviteUrl
            }
        }`
      });
    }    
  }

  // fetch invite
  getInvite(inviteHash: string): any {
    return this.apollo.watchQuery<InviteQuery>({
      query: gql(`query {
        getInvite(inviteHash: "${inviteHash}") {
          orgId,
          username,
          inviteHash,
          expiredDate,
          inviteUrl
        }
      }`),
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  // fetch invite mail data
  getInviteMailData(inviteHash: string): any {
    return this.apollo.watchQuery<InviteQuery>({
      query: gql(`query {
        getInviteMailData(inviteHash: "${inviteHash}") {
          subject,
          body
          }
      }`),
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  // send invitation email
  sendInviteMail(inviteMailData: InviteMailData): any {
    const inviteMailDataRequest = new InviteMailDataRequestInput(inviteMailData);
    return this.apollo.mutate({
      mutation: gql`mutation ($inviteMailDataRequest: InviteMailDataRequestInput) {
        sendInviteMail(inviteMailDataRequest: $inviteMailDataRequest)
      }`,
      variables: {
        inviteMailDataRequest: inviteMailDataRequest
      }
    });
  }

}
