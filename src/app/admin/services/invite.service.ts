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
      return this.coreGraphQLService.coreGQLReqForMutation(gql`mutation {
        createInvite(orgId: "${this.authService.currentUser.orgId}") {
              orgId,
              username,
              inviteHash,
              expiredDate,
              inviteUrl,
              inviteHash
          }
      }`);
    }
  }

  // fetch invite
  getInvite(inviteHash: string): any {
    return this.coreGraphQLService.coreGQLReq<InviteQuery>(gql(`query {
      getInvite(inviteHash: "${inviteHash}") {
        orgId,
        username,
        inviteHash,
        expiredDate,
        inviteUrl
        inviteHash
      }
    }`),'no-cache');
  }

  // fetch invite mail data
  getInviteMailData(inviteHash: string): any {

    return this.coreGraphQLService.coreGQLReq<InviteQuery>(gql(`query {
      getInviteMailData(inviteHash: "${inviteHash}") {
        subject,
        body,
        inviteHash,
        inviteUrl
        }
    }`),'no-cache');
  }

  // send invitation email
  sendInviteMail(inviteMailData: InviteMailData): any {
    const inviteMailDataRequest = new InviteMailDataRequestInput(inviteMailData);
    return this.coreGraphQLService.coreGQLReqForMutation(gql`mutation ($inviteMailDataRequest: InviteMailDataRequestInput) {
      sendInviteMail(inviteMailDataRequest: $inviteMailDataRequest)
    }`,{inviteMailDataRequest: inviteMailDataRequest});
  }

  getUserByInvite(inviteHash: string): any {
    return this.coreGraphQLService.coreGQLReq<UserQuery>(gql(`query {
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
    }`), 'no-cache');
  }

  updateInvitedUser(user: User, inviteHash: string): any {
    const userRequest = new InvitedUserRequestInput(user);
    return this.coreGraphQLService.coreGQLReqForMutation(gql`mutation updateInvitedUser($user: InvitedUserRequestInput, $inviteHash: String) {
      updateInvitedUser(user: $user, inviteHash: $inviteHash)
      }`, { user: userRequest, inviteHash: inviteHash });
  }

  // fetch organization name for invite  
  getOrgDataByInvite(inviteHash: string) {
    return this.coreGraphQLService.coreGQLReq<InviteOrganizationDataQuery>(gql(`query {
      inviteOrg(inviteHash: "${inviteHash}") {
          name
        }
      }`,), 'no-cache');
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
