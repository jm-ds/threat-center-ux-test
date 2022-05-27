import { Injectable } from '@angular/core';
import { Permission, Role } from '@app/models/role';
import { RepositoryAccounts } from '@app/threat-center/shared/models/types';
import { PageInfo } from './common';
import { EntityConnection } from './entity';


export class User {
  accessToken: string;
  id: number;
  username: string;
  password: string;
  fname: string;
  lname: string;
  created: Date;
  email: string;
  orgId: string;
  defaultEntityId: string;

  // lists returned by gql inner queries
  userRoles: Role[];
  userEntities: EntityConnection = new EntityConnection();
  userPermissions: Permission[];

  // lists as user class fields
  roles: Role[];
  permissions: string[];

  authorities: Authority[];

  // organization
  organization: OrganizationModel;

  approved: boolean;
  coverLetter: string;
  phone: string;
  position: string;

  avatarUrl: string;
  // api keys
  apiKeys: ApiKeyConnection;

  invitedByUsername: string;

  repositoryAccounts: RepositoryAccounts;
}

export class OrganizationModel {
  name: string;
  created: string | any;
  orgId: string;
  tenantId: string;
}

export interface Authority {
  authority: string;
}


export interface UsersQuery {
  users: UserConnection;
}

export interface UserQuery {
  user: User;
}

export class UserRequestInput {
  readonly email: string;
  readonly fname: string;
  readonly lname: string;

  readonly entities: string[];
  readonly roles: string[];
  readonly permissions: string[];

  readonly defaultEntityId: string;
  readonly username: string;

  constructor(email: string, fname: string, lname: string, entities: string[], roles: string[], permissions: string[], defaultEntityId: string, username: string) {
    this.email = email;
    this.fname = fname;
    this.lname = lname;
    this.entities = entities;
    this.roles = roles;
    this.permissions = permissions;
    this.defaultEntityId = defaultEntityId;
    this.username = username;
  }

  static from(user: User) {
    let roles;
    if (user.userRoles != null && user.userRoles.length > 0) {
      roles = user.userRoles.map(role => role.roleId);
    } else {
      roles = [];
    }

    let entities;
    if (user.userEntities != null && user.userEntities.edges && user.userEntities.edges.length > 0) {
      entities = user.userEntities.edges.map(edge => edge.node.entityId);
    } else {
      entities = [];
    }

    let permissions;
    if (user.userPermissions != null && user.userPermissions.length > 0) {
      permissions = user.userPermissions.map(permission => permission.name);
    } else {
      permissions = [];
    }

    return new UserRequestInput(user.email, user.fname, user.lname, entities, roles, permissions, user.defaultEntityId, user.username);
  }
}


export class UserConnection {
  edges: UserEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class UserEdge {
  node: User;
  cursor: string;
}


@Injectable()
export class Invite {
  readonly orgId: string;
  readonly username: string;
  readonly inviteHash: string;
  readonly inviteUrl: string;
  readonly expiredDate: Date;
}


export interface InviteQuery {
  invite: Invite;
}

@Injectable()
export class InviteMailData {
  readonly inviteUrl: string;
  readonly inviteHash: string;
  to: string;
  subject: string;
  body: string;
}

export class InviteMailDataRequestInput {
  readonly inviteMailData: InviteMailData;

  constructor(inviteMailData: InviteMailData) {
    this.inviteMailData = inviteMailData;
    delete inviteMailData['__typename'];
  }
}

export class InviteOrganizationData {
  readonly name: string;
}

export interface InviteOrganizationDataQuery {
  inviteOrg: InviteOrganizationData;
}


export class ApiKey {
  orgId: string;
  username: string;
  keyId: string;
  apiKey: string;
  title: string;
  description: string;
  createdDate: Date;
  expiredDate: Date;
}

export class ApiKeyConnection {
  edges: ApiKeyEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class ApiKeyEdge {
  node: ApiKey;
  cursor: string;
}

export interface ApiKeyQuery {
  apiKey: ApiKey;
}

export interface ApiKeyConnectionQuery {
  orgApiKeys: ApiKeyConnection;
}

export class ApiKeyRequestInput {
  readonly orgId: string;
  readonly username: string;
  readonly keyId: string;
  readonly apiKey: string;
  readonly title: string;
  readonly description: string;
  readonly expiredDate: Date;

  constructor(orgId: string, username: string, keyId: string, apiKey: string, title: string, description: string, expiredDate: Date) {
    this.orgId = orgId;
    this.username = username;
    this.keyId = keyId;
    this.apiKey = apiKey;
    this.title = title;
    this.title = title;
    this.description = description;
    this.expiredDate = expiredDate;
  }

  static from(apiKey: ApiKey) {
    return new ApiKeyRequestInput(apiKey.orgId, apiKey.username, apiKey.keyId, apiKey.apiKey,
      apiKey.title, apiKey.description, apiKey.expiredDate);
  }
}

export class GetUserQuery {
  getUser: User;
}

export class AccountCreateMutation {
  createAccount: AuthenticationResponse;
}

export class AuthenticationResponse {
  jwt: string;
  user: User;
}

export class FormAccountRequest {
  email: string;
  fullName: string;
  phone: string;
  password: string;
  companyName: string;
  position: string;
  coverLetter: string;
  inviteHash: string;


  constructor(email: string, fullName: string, phone: string, password: string, companyName: string,
              position: string, coverLetter: string, inviteHash: string) {
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.password = password;
    this.companyName = companyName;
    this.position = position;
    this.coverLetter = coverLetter;
    this.inviteHash = inviteHash;
  }
}

export class AccountUpdateRequest {
  email: string;
  orgName: string;
  coverLetter: string;
  phone: string;
  position: string;


  constructor(email: string, orgName: string, coverLetter: string, phone: string, position: string) {
    this.email = email;
    this.orgName = orgName;
    this.coverLetter = coverLetter;
    this.phone = phone;
    this.position = position;
  }
}

export class AccountUpdateMutation {
  updateAccount: User;
}



