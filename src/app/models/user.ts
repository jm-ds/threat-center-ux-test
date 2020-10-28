import {Permission, Role} from "@app/models/role";
import {EntityConnection, PageInfo} from "@app/threat-center/shared/models/types";

export class User {
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
    userEntities: EntityConnection;
    userPermissions: Permission[];

    // lists as user class fields
    roles: Role[];
    permissions: string[];

    authorities: Authority[];
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