import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import { Permission, PermissionsQuery, Role, RoleQuery, RoleRequestInput, RolesQuery } from "@app/models";
import gql from "graphql-tag";
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(private apollo: Apollo, private coreGraphQLService: CoreGraphQLService) {
    }

    getRoleList() {
        return this.coreGraphQLService.coreGQLReq<RolesQuery>(
            gql`query {
                roles {
                    roleId,
                    description
                }
            }`);
    }

    getRole(roleId: string) {
        return this.coreGraphQLService.coreGQLReq<RoleQuery>(
            gql`query {
                role(roleId: "${roleId}") {
                    roleId,
                    description,
                    rolePermissions {
                        name,
                        title,
                        description
                    }
                }
            }`);
    }

    getPermissionList() {
        return this.coreGraphQLService.coreGQLReq<PermissionsQuery>(
            gql`query {
                permissions {
                    name,
                    title
                    description
                }
            }`);
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
