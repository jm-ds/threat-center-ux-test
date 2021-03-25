import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import { Role, RoleRequestInput, User, UserQuery, UserRequestInput, UsersQuery } from "@app/models";
import gql from "graphql-tag";
import { Entity } from "@app/threat-center/shared/models/types";
import { CoreGraphQLService } from '@app/core/services/core-graphql.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private apollo: Apollo, private coreGraphQLService: CoreGraphQLService) {
    }

    getUserList() {
        return this.coreGraphQLService.coreGQLReq<UsersQuery>(
            gql`query {
                users {
                    edges{
                      node {
                        orgId,
                        username,
                        email,
                        fname,
                        lname,
                        created,
                        permissions,
                        avatarUrl,
                        userRoles {
                            roleId,
                            description,
                            permissions
                        },
                        userEntities {
                          edges {
                            node{
                              name
                            }
                          }
                        }
                      }
                    }
                }
            }`);
    }

    getUser(username: string) {
        return this.coreGraphQLService.coreGQLReq<UserQuery>(
            gql`query {
                user(username: "${username}") {
                    orgId,
                    username,
                    email,
                    fname,
                    lname,
                    created,
                    avatarUrl,
                    userRoles {
                        roleId,
                        description,
                        rolePermissions {
                            name,
                            title,
                            description
                        }
                    },
                    userEntities {
                      edges{
                        node{
                          entityId,
                          name
                        }
                      }
                    },
                    userPermissions {
                        name,
                        title,
                        description
                    }
                }
            }`);
    }

    saveRoles(username: string, roles: Role[]) {
        const roleIdList = roles.map(role => role.roleId);
        return this.apollo.mutate({
            mutation: gql`
            mutation setRolesToUser($username: String, $roles: [String]) {
                setRolesToUser(username: $username, roles: $roles) {
                    orgId,
                    username,
                    email,
                    fname,
                    lname,
                    userRoles {
                        roleId,
                        description,
                        permissions
                    },
                    permissions
                }
            }`,
            variables: {
                username: username,
                roles: roleIdList
            }
        });
    }

    saveUser(user: User, newUser = true) {
        let mutationName;
        if (newUser) {
            mutationName = "createUser";
        }
        else {
            mutationName = "updateUser";
        }

        const userRequest = UserRequestInput.from(user);

        return this.apollo.mutate({
            mutation: gql`
            mutation ${mutationName}($user: UserRequestInput) {
                ${mutationName}(user: $user) {
                    orgId,
                    username,
                    email,
                    fname,
                    lname,
                    userRoles {
                        roleId,
                        description,
                        permissions
                    },
                    permissions
                }
            }`,
            variables: {
                user: userRequest
            }
        });
    }
}
