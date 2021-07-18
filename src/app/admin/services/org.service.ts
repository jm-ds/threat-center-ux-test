import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/core/services/core-graphql.service";
import { ApiKey, ApiKeyConnectionQuery, ApiKeyQuery, ApiKeyRequestInput, JiraCredentials, OrgSettingsQuery } from "@app/models";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { Observable } from "rxjs";
import { EntitySettingsRequestInput } from "../entity/entity.class";

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(private coreGraphQLService: CoreGraphQLService, private apollo: Apollo) {
  }

  //get org settings
  getOrgSettings(): Observable<ApolloQueryResult<OrgSettingsQuery>> {
    return this.coreGraphQLService.coreGQLReqWithQuery<OrgSettingsQuery>(
      gql`
        query {
          orgSettings {
            entityId
            alertEmailAdressess
            alertSlackUrls
            jiraCredentials {
              projectUrl
              projectKey
              email
              apiToken
            }
          }
        }
      `, "no-cache");
  }

  // set org alert emails
  setOrgEmails(entityId: string, alertEmailAdressess: string[]) {
    const entitySettingsRequest = EntitySettingsRequestInput.forEmails(entityId, alertEmailAdressess);
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation setOrgEmails($entitySettingsRequest: EntitySettingsRequestInput){
        setOrgEmails(entitySetting: $entitySettingsRequest){
          alertEmailAdressess
        }
      }`, { entitySettingsRequest: entitySettingsRequest });
  }

  //set org slack urls
  setOrgSlackUrls(entityId: string, alertSlackUrls: string[]) {
    const entitySettingsRequest = EntitySettingsRequestInput.forSlackUrl(entityId, alertSlackUrls);
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation setOrgSlackUrls($entitySettingsRequest: EntitySettingsRequestInput){
        setOrgSlackUrls(entitySetting: $entitySettingsRequest){
          alertSlackUrls
        }
      }`, { entitySettingsRequest: entitySettingsRequest });
  }

  //set org jira settings
  setOrgJiraCredentials(entityId: string, jiraCredentials: JiraCredentials) {
    const entitySettingsRequest = EntitySettingsRequestInput.forJira(entityId, jiraCredentials);
    delete entitySettingsRequest.jiraCredentials["__typename"];
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`mutation setOrgJiraCredentials($entitySettingsRequest: EntitySettingsRequestInput){
        setOrgJiraCredentials(entitySetting: $entitySettingsRequest){
          jiraCredentials {
            projectUrl
            projectKey
            email
            apiToken
          }
        }
      }`, { entitySettingsRequest: entitySettingsRequest });
  }


  //get org api keys
  getOrgApiKeys(): Observable<ApolloQueryResult<ApiKeyConnectionQuery>> {
    return this.coreGraphQLService.coreGQLReqWithQuery<ApiKeyConnectionQuery>(
      gql`
        query {
          orgApiKeys(first: 10000) {
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
      `, "no-cache");
  }

  // fetch org API key
  getOrgApiKey(keyId: string) {
    return this.coreGraphQLService.coreGQLReq<ApiKeyQuery>(
        gql`query {
          apiKey: orgApiKey(keyId: "${keyId}") {
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

  // post "generate org API key" command
  generateOrgApiKey(apiKey: ApiKey) {
    const apiKeyRequest = ApiKeyRequestInput.from(apiKey);

    return this.apollo.mutate({
        mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
          generateApiKey: generateOrgApiKey(apiKeyRequest: $apiKeyRequest) {
                keyId
            }
        }`,
        variables: {
            apiKeyRequest: apiKeyRequest
        }
    });
  }


  // post "update org API key" command
  updateOrgApiKey(apiKey: ApiKey) {
    const apiKeyRequest = ApiKeyRequestInput.from(apiKey);
    return this.apollo.mutate({
        mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
          updateApiKey: updateOrgApiKey(apiKeyRequest: $apiKeyRequest) {
                keyId
            }
        }`,
        variables: {
            apiKeyRequest: apiKeyRequest
        }
    });
  }


  // post "remove org API key" command
  removeOrgApiKey(apiKey: ApiKey) {
      const apiKeyRequest = ApiKeyRequestInput.from(apiKey);

      return this.apollo.mutate({
          mutation: gql`mutation ($apiKeyRequest: ApiKeyRequestInput) {
            removeApiKey: removeOrgApiKey(apiKeyRequest: $apiKeyRequest) {
                  keyId
              }
          }`,
          variables: {
              apiKeyRequest: apiKeyRequest
          }
      });
  }

}