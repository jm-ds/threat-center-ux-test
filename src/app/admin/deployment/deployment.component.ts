import { Component, OnInit } from '@angular/core';
import { DeploymentSettings } from '@app/models';
import { DeploymentService } from '@app/services/deployment.service';
import { AlertService } from '@app/services/core/alert.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit {

  deploymentSettings: DeploymentSettings;

  constructor(private deploymentService: DeploymentService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.deploymentSettings = new DeploymentSettings();
    this.deploymentService.getDeploymentData().subscribe(value => {
      if (value.data.deploymentSettings) {
        this.deploymentSettings = value.data.deploymentSettings;
      }
    });
  }

  validateData() {
    if (this.deploymentSettings.deploymentMode === 'HYBRID') {
      if (this.deploymentSettings.cloudServerUrl &&
        this.deploymentSettings.cloudApiKey &&
        this.deploymentSettings.cloudThreatrixSchemeIp) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  saveDeploymentData() {
    this.deploymentService.saveDeploymentData(this.deploymentSettings).subscribe(value => {
      this.alertService.alertBox('Successfully saved', 'Deployments settings', 'success');
    }, error => {
      this.alertService.alertBox('Error while saving Deployments settings', 'Deployments settings', 'error');
    });
  }

}
