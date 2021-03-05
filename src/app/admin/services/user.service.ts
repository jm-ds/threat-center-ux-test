import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import { ApiKey, ApiKeyQuery, ApiKeyRequestInput, Role, RoleRequestInput, User, UserQuery, UserRequestInput, UsersQuery } from "@app/models";
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
                    },
                    apiKeys {
                        edges {
                            node {
                                apiKey,
                                keyId,
                                title,
                                description,
                                createdDate,
                                expiredDate
                            }
                        }
                    }
                }
            }`, 'no-cache');
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


    // fetch API key
    getApiKey(username: string, keyId: string) {
        return this.coreGraphQLService.coreGQLReq<ApiKeyQuery>(
            gql`query {
                apiKey(username: "${username}", keyId: "${keyId}") {
                    apiKey,
                    username,
                    keyId,
                    title,
                    description,
                    createdDate,
                    expiredDate
                }
            }`, 'no-cache');
    }


    // post "generate API key" command
    generateApiKey(apiKey: ApiKey) {
        const apiKeyRequest = ApiKeyRequestInput.from(apiKey);

        return this.apollo.mutate({
            mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
                generateApiKey(apiKeyRequest: $apiKeyRequest) {
                    keyId
                }
            }`,
            variables: {
                apiKeyRequest: apiKeyRequest
            }
        });
    }


    // post "update API key" command
    updateApiKey(apiKey: ApiKey) {
        const apiKeyRequest = ApiKeyRequestInput.from(apiKey);
        return this.apollo.mutate({
            mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
                updateApiKey(apiKeyRequest: $apiKeyRequest) {
                    keyId
                } 
            }`,
            variables: {
                apiKeyRequest: apiKeyRequest
            }
        });
    }


    // post "remove API key" command
    removeApiKey(apiKey: ApiKey) {
        const apiKeyRequest = ApiKeyRequestInput.from(apiKey);

        return this.apollo.mutate({
            mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
                removeApiKey(apiKeyRequest: $apiKeyRequest) {
                    keyId
                } 
            }`,
            variables: {
                apiKeyRequest: apiKeyRequest
            }
        });
    }
}
