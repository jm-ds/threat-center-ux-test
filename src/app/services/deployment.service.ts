import { Injectable } from '@angular/core';
import { CoreGraphQLService } from '@app/services/core/core-graphql.service';
import gql from 'graphql-tag';
import { DeploymentDataQuery, DeploymentSettings } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {

  constructor(private coreGraphQLService: CoreGraphQLService) {
  }

  getDeploymentData() {
    return this.coreGraphQLService.coreGQLReq<DeploymentDataQuery>(gql`
      query {
        deploymentSettings {
          orgId,
          deploymentMode,
          cloudServerUrl,
          cloudThreatrixSchemeIp,
          cloudApiKey
        }
      }`
    );
  }

  saveDeploymentData(deploymentSettings: DeploymentSettings) {
    const deploymentSettingsInput = new DeploymentSettingsInput(
      deploymentSettings.orgId,
      deploymentSettings.deploymentMode,
      deploymentSettings.cloudServerUrl,
      deploymentSettings.cloudThreatrixSchemeIp,
      deploymentSettings.cloudApiKey
    );
    return this.coreGraphQLService.coreGQLReqForMutation(
      gql`
        mutation saveDeploymentSettings($deploymentSettingsInput: DeploymentSettingsInput) {
          saveDeploymentSettings(deploymentSettings: $deploymentSettingsInput) {
            orgId,
            deploymentMode,
            cloudServerUrl,
            cloudThreatrixSchemeIp,
            cloudApiKey
          }
        }
        `, {deploymentSettingsInput}
    );
  }
}

export class DeploymentSettingsInput {
  readonly orgId: string;
  readonly deploymentMode: string;
  readonly cloudServerUrl: string;
  readonly cloudThreatrixSchemeIp: string;
  readonly cloudApiKey: string;

  constructor(orgId: string, deploymentMode: string, cloudServerUrl: string, cloudThreatrixSchemeIp: string, cloudApiKey: string) {
    this.orgId = orgId;
    this.deploymentMode = deploymentMode;
    this.cloudServerUrl = cloudServerUrl;
    this.cloudThreatrixSchemeIp = cloudThreatrixSchemeIp;
    this.cloudApiKey = cloudApiKey;
  }
}
