import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { EntityRequestInput, EntitySettingsRequestInput, EntityUpdateRequestInput, OrganizationUpdateRequestInput } from "@app/admin/entity/entity.class";
import { CoreGraphQLService } from "@app/core/services/core-graphql.service";
import { EntityArray, EntityQuery, JiraCredentials } from "@app/models";
import { AuthenticationService } from "@app/security/services";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EntityManageService {
    constructor(private coreGraphQLService: CoreGraphQLService) { }

    getTopLevelEntitiesByOrg(orgId: string): Observable<ApolloQueryResult<EntityArray>> {
        return this.coreGraphQLService.coreGQLReqWithQuery<EntityArray>(
            gql`
            query {
              topLevelEntitiesByOrg(orgId: "${orgId}") {
                  entityId,
                  name,
                  entityType,
                  removed,
                  childEntities {
                      edges {
                          node {
                              entityId
                              parentEntityId
                              name
                              entityType
                              removed
                          }
                      }    
                  }
              }
            }`, "no-cache");
    }

    //get tree entity data
    getTreeEntity(entityId: string): Observable<ApolloQueryResult<EntityQuery>> {
        return this.coreGraphQLService.coreGQLReqWithQuery<EntityQuery>(
            gql`
            query {
              entity(entityId: "${entityId}") {
                entityId
                parentEntityId
                name
                entityType
                removed
                parents {
                  entityId
                  name
                }
                entityMetricsSummaryGroup {
                  entityMetricsSummaries {
                    measureDate
                    vulnerabilityMetrics {
                        critical
                        high
                        medium
                        low
                        info
                    }
                    licenseMetrics {
                        copyleftStrong
                        copyleftWeak
                        copyleftPartial
                        copyleftLimited
                        copyleft
                        custom
                        dual
                        permissive
                    }
                    supplyChainMetrics {
                        risk
                        quality
                    }
                    assetMetrics {
                        embedded
                        openSource
                        unique
                    }
                  }
                }
                childEntities {
                  edges {
                    node {
                      entityId
                      parentEntityId
                      name
                      entityType
                      removed
                    }
                  }    
                }
              }
            }
          `, "no-cache");
    }

    //create entitu server call
    createEntity(entityReqPayload: { entityName: string, entityType: string, parentEntityId: string }) {
        const entityRequest = EntityRequestInput.from(entityReqPayload);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation createEntity($entity: EntityRequestInput){
            createEntity(entity: $entity){
              entityId
                parentEntityId
                name
                entityType
                removed
                childEntities {
                  edges {
                    node {
                      entityId
                      parentEntityId
                      name
                      entityType
                      removed
                    }
                  }    
                }
              }
        }`, { entity: entityRequest });
    }

    //update entity server call
    updateEntity(entityReqPayload: { entityId: string, entityName: string, entityType: string }) {
        const entityRequest = EntityUpdateRequestInput.from(entityReqPayload);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation updateEntity($entity: EntityRequestInput){
            updateEntity(entity: $entity){
              entityId
              parentEntityId
              name
              entityType
              removed
            }
          }`, { entity: entityRequest });
    }

    //Update Organization Name
    updateOrganizationName(orgNameRequest: { orgId: string, name: string }) {
        const orgRequest = OrganizationUpdateRequestInput.from(orgNameRequest);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation updateOrgName($orgNameRequest: OrgNameRequestInput) {
            updateOrgName(orgNameRequest: $orgNameRequest) {
                orgId,
                name
            }
        }`, { orgNameRequest: orgRequest });
    }

    //delete entity server call
    deleteEntity(entityId: string) {
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation {
              removeEntity(entityId:"${entityId}"){
              entityId
              parentEntityId
              name
              entityType
              removed
            }
          }`);
    }

    //get entity settings
    getEntitySettings(entityId: string): Observable<ApolloQueryResult<EntityQuery>> {
        return this.coreGraphQLService.coreGQLReqWithQuery<EntityQuery>(
            gql`
            query {
              entity(entityId: "${entityId}") {
                entityId
                entitySettings {
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
            }
          `, "no-cache");
    }

    // set entity alert emails
    setEntityEmails(entityId: string, alertEmailAdressess: string[]) {
        const entitySettingsRequest = EntitySettingsRequestInput.forEmails(entityId, alertEmailAdressess);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation setEntityEmails($entitySettingsRequest: EntitySettingsRequestInput){
            setEntityEmails(entitySetting: $entitySettingsRequest){
              entityId
              alertEmailAdressess
            }
          }`, { entitySettingsRequest: entitySettingsRequest });
    }

    //set entity slack urls
    setEntitySlackUrls(entityId: string, alertSlackUrls: string[]) {
        const entitySettingsRequest = EntitySettingsRequestInput.forSlackUrl(entityId, alertSlackUrls);
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation setEntitySlackUrls($entitySettingsRequest: EntitySettingsRequestInput){
            setEntitySlackUrls(entitySetting: $entitySettingsRequest){
              entityId
              alertSlackUrls
            }
          }`, { entitySettingsRequest: entitySettingsRequest });
    }

    //set entity jira settings
    setEntityJiraCredentials(entityId: string, jiraCredentials: JiraCredentials) {
        const entitySettingsRequest = EntitySettingsRequestInput.forJira(entityId, jiraCredentials);
        delete entitySettingsRequest.jiraCredentials["__typename"];
        return this.coreGraphQLService.coreGQLReqForMutation(
            gql`mutation setEntityJiraCredentials($entitySettingsRequest: EntitySettingsRequestInput){
            setEntityJiraCredentials(entitySetting: $entitySettingsRequest){
              entityId
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



@Injectable({
    providedIn: 'root'
})

export class GetDefaultEntityResolver implements Resolve<Observable<any>> {
    constructor(
        private entityService: EntityManageService,
        private authService: AuthenticationService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.entityService.getTreeEntity(this.authService.currentUser.defaultEntityId);
    }
}