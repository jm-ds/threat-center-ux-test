import { Injectable } from '@angular/core';
import { EntityModel } from '@app/admin/entity/entity.class';
import { Permission, Role } from "@app/models/role";
import { PageInfo } from './common';
import { EntityConnection } from './entity';


export class User {
    accessToken: string;
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    fname: string;
    lname: string;
    created: Date;
    email: string;
    orgId: string;
    defaultEntityId: string;
    authdata?: string;

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


    constructor(email: string, fname: string, lname: string, entities: string[], roles: string[], permissions: string[]) {
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.entities = entities;
        this.roles = roles;
        this.permissions = permissions;
    }

    static from(user: User) {
        let roles;
        if (user.userRoles != null && user.userRoles.length > 0) {
            roles = user.userRoles.map(role => role.roleId);
        }
        else {
            roles = [];
        }

        let entities;
        if (user.userEntities != null && user.userEntities.edges && user.userEntities.edges.length > 0) {
            entities = user.userEntities.edges.map(edge => edge.node.entityId);
        }
        else {
            entities = [];
        }

        let permissions;
        if (user.userPermissions != null && user.userPermissions.length > 0) {
            permissions = user.userPermissions.map(permission => permission.name);
        }
        else {
            permissions = [];
        }

        return new UserRequestInput(user.email, user.fname, user.lname, entities, roles, permissions);
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
    to: string;
    subject: string;
    body: string;
}

export class InviteMailDataRequestInput {
    readonly inviteMailData: InviteMailData;
    constructor(inviteMailData: InviteMailData) {
        this.inviteMailData = inviteMailData;
        delete inviteMailData["__typename"];
    }
}        


