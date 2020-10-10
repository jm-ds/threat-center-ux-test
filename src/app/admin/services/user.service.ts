import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {Role, RoleRequestInput, User, UserQuery, UserRequestInput, UsersQuery} from "@app/models";
import gql from "graphql-tag";
import {Entity} from "@app/threat-center/shared/models/types";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private apollo: Apollo) {
    }

    getUserList() {
        return this.apollo.watchQuery<UsersQuery>({
            query: gql`query {
                users {
                    orgId,
                    username,
                    email,
                    fname,
                    lname,
                    created,
                    permissions,
                    userRoles {
                        roleId,
                        description,
                        permissions
                    },
                    userEntities {
                        name
                    }
                }
            }`
        }).valueChanges;
    }

    getUser(username: string) {
        return this.apollo.watchQuery<UserQuery>({
            query: gql`query {
                user(username: "${username}") {
                    orgId,
                    username,
                    email,
                    fname,
                    lname,
                    created,
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
                        entityId,
                        name
                    },
                    userPermissions {
                        name,
                        title,
                        description
                    }
                }
            }`
        }).valueChanges;
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
