import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {Permission, PermissionsQuery, Role, RoleQuery, RoleRequestInput, RolesQuery} from "@app/models";
import gql from "graphql-tag";

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(private apollo: Apollo) {
    }

    getRoleList() {
        return this.apollo.watchQuery<RolesQuery>({
            query: gql`query {
                roles {
                    roleId,
                    description
                }
            }`
        }).valueChanges;
    }

    getRole(roleId: string) {
        return this.apollo.watchQuery<RoleQuery>({
            query: gql`query {
                        role(roleId: "${roleId}") {
                            roleId,
                            description,
                            rolePermissions {
                                name,
                                title,
                                description
                            }
                        }
                    }`
        }).valueChanges;
    }

    getPermissionList() {
        return this.apollo.watchQuery<PermissionsQuery>({
            query: gql`query {
                            permissions {
                                name,
                                title
                                description
                            }
                        }`
        }).valueChanges;
    }


    saveRole(role: Role, permissions: Permission[], newRole = true) {
        let mutationName;
        if (newRole) {
            mutationName = "createRole";
        }
        else {
            mutationName = "updateRole";
        }

        const roleRequest = RoleRequestInput.from(role, permissions);

        return this.apollo.mutate({
            mutation: gql`mutation ${mutationName}($role: RoleRequestInput) {
                ${mutationName}(role: $role) {
                    orgId,
                    roleId,
                    permissions,
                    description
                }
            }`,
            variables: {
                role: roleRequest
            }
        });
    }


    removeRole(role: Role) {
        const roleRequest = RoleRequestInput.from(role);
        return this.apollo.mutate({
            mutation: gql`mutation removeRole($role: RoleRequestInput) {
                removeRole(role: $role) {
                    orgId,
                    roleId,
                    removed
                }
            }`,
            variables: {
                role: roleRequest
            }
        });
    }


}
