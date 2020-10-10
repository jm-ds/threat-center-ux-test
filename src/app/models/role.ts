import {User} from "@app/models/user";

export class Role {
    roleId: string;
    description: string;
    permissions: string[];
    rolePermissions: Permission[];
}

export class RoleRequestInput {
    readonly roleId: string;
    readonly description: string;
    readonly permissions: string[];

    constructor(roleId: string, description: string, permissions: string[]) {
        this.roleId = roleId;
        this.description = description;
        this.permissions = permissions;
    }

    static from(role: Role, permissions?: Permission[] | string[] ) {
        let rolePermissions: string[];

        if (typeof permissions !== 'undefined') {
            rolePermissions = permissions as string[];
            if (Array.isArray(permissions) && permissions.every(item => typeof item === "object")) {
                rolePermissions = (permissions as Permission[]).map(permission => permission.name);
            }
            return new RoleRequestInput(role.roleId, role.description, rolePermissions);
        }

        if (role.permissions !== undefined && role.permissions.length > 0) {
            rolePermissions = role.permissions;
        }
        else if (role.rolePermissions !== undefined && role.rolePermissions.length > 0) {
            rolePermissions = role.rolePermissions.map(permission => permission.name);
        }
        else {
            rolePermissions = [];
        }

        return new RoleRequestInput(role.roleId, role.description, rolePermissions);
    }
}

export interface RolesQuery {
    roles: Role[];
}

export interface RoleQuery {
    role: Role;
}

export class Permission {
    name: string;
    title: string;
    description: string;
}

export interface PermissionsQuery {
    permissions: Permission[];
}
