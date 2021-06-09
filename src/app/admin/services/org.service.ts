import { Injectable } from "@angular/core";
import { CoreGraphQLService } from "@app/core/services/core-graphql.service";
import { JiraCredentials, OrgSettingsQuery } from "@app/models";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { Observable } from "rxjs";
import { EntitySettingsRequestInput } from "../entity/entity.class";

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(private coreGraphQLService: CoreGraphQLService) {
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

}