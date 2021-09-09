import {Injectable} from '@angular/core';
import {CoreGraphQLService} from '@app/core/services/core-graphql.service';
import {AuthenticationService} from '@app/security/services';
import gql from 'graphql-tag';
import {Apollo} from "apollo-angular";
import {InviteMailData, InviteMailDataRequestInput, InviteOrganizationDataQuery, InviteQuery, User, UserQuery} from '@app/models';
import {CoreHelperService} from '@app/core/services/core-helper.service';
import {AlertService} from '@app/core/services/alert.service';

@Injectable({
    providedIn: 'root'
})


export class InviteService {
    constructor(
        private coreGraphQLService: CoreGraphQLService,
        private authService: AuthenticationService,
        private apollo: Apollo,
        private coreHelperService: CoreHelperService,
        private alertService: AlertService
    ) {
    }


  // creates invite
  createInvite(): any {
    if (!this.authService.currentUser || !this.authService.currentUser.orgId) {
      this.alertService.alertBox('Organization not found!', 'Not Found', 'error');
      return undefined;
    } else {
      return this.apollo.mutate<InviteQuery>({
        mutation: gql`mutation {
          createInvite(orgId: "${this.authService.currentUser.orgId}") {
                orgId,
                username,
                inviteHash,
                expiredDate,
                inviteUrl,
                inviteHash
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
          inviteHash
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
          body,
          inviteHash,
          inviteUrl
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

  getUserByInvite(inviteHash: string): any {
      return this.apollo.watchQuery<UserQuery>({
          query: gql(`query {
      getUserByInvite(inviteHash: "${inviteHash}") {
        orgId,
        username,
        email,
        fname,
        lname,
        position,
        phone,
        created,
      }
    }`), fetchPolicy: 'no-cache'
      }).valueChanges;
  }

  updateInvitedUser(user: User, inviteHash: string): any {
      const userRequest = new InvitedUserRequestInput(user);

      return this.apollo.mutate({
          mutation: gql`mutation updateInvitedUser($user: InvitedUserRequestInput, $inviteHash: String) {
              updateInvitedUser(user: $user, inviteHash: $inviteHash)
          }`, variables: {user: userRequest, inviteHash: inviteHash}
      });
  }

  // fetch organization name for invite  
  getOrgDataByInvite(inviteHash: string) {
    return this.apollo.watchQuery<InviteOrganizationDataQuery>({
        query: gql(`query {
          inviteOrg(inviteHash: "${inviteHash}") {
              name
            }
          }`
        ), fetchPolicy: 'no-cache'
    }).valueChanges;
  }

}

export class InvitedUserRequestInput {
    username: string;
    password: string;
    fname: string;
    lname: string;
    email: string;
    orgId: string;
    phone: string;
    position: string;

    constructor(user: User) {
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.phone = user.phone;
        this.fname = user.fname;
        this.lname = user.lname;
        this.orgId = user.orgId;
        this.position = user.position;
    }

}
