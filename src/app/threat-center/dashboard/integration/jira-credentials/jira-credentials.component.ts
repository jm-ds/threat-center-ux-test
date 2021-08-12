import { Component, Injectable, Input, OnInit } from '@angular/core';
import { EntityService } from '@app/admin/services/entity.service';
import { OrgService } from '@app/admin/services/org.service';
import { AlertService } from '@app/core/services/alert.service';
import { EntitySettings, JiraCredentials } from '@app/models/entity';
import Swal from 'sweetalert2';


@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'jira-credentials',
    templateUrl: './jira-credentials.component.html',
    styleUrls: ['./jira-credentials.component.scss']
})
export class JiraCredentialsComponent implements OnInit {
  @Input() public entitySettings: EntitySettings
  @Input() public entityId: string;

  constructor(
    private orgService: OrgService,
    private entityService: EntityService,
    private alertService:AlertService
  ) {
  }

  ngOnInit() {
    if (!this.entitySettings || !this.entitySettings.entityId) {
      this.entitySettings = new EntitySettings();
      this.entitySettings.entityId = this.entityId;
    }
    if (!this.entitySettings.jiraCredentials) {
      this.entitySettings.jiraCredentials = new JiraCredentials();
    }
  }


  // save urls
  saveCredentials() {
    if (!this.entitySettings.entityId || this.entitySettings.entityId.substring(0,1) === '0') {
      this.orgService.setOrgJiraCredentials(this.entitySettings.entityId, this.entitySettings.jiraCredentials)
      .subscribe(({data}) => {
        Swal.close();
        this.alertService.alertBox('Successfully saved','JIRA credentials','success');
      }, 
       (error) => {
        console.error('Slack jira credential saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving JIRA credentials','Saving JIRA credentials','error');
       }
      );
    } else {
      this.entityService.setEntityJiraCredentials(this.entitySettings.entityId, this.entitySettings.jiraCredentials)
      .subscribe(({data}) => {
        Swal.close();
        this.alertService.alertBox('Successfully saved','JIRA credentials','success');
      }, 
       (error) => {
        console.error('Slack jira credential saving error', error);
        Swal.close();
        this.alertService.alertBox('Error while saving JIRA credentials','Saving JIRA credentials','error');
       }
      );
    }
  }

  // validate datas
  validateData() {
    const jiraCredentials = this.entitySettings.jiraCredentials;
    if (!jiraCredentials.projectUrl || !jiraCredentials.projectKey || !jiraCredentials.email || !jiraCredentials.apiToken) {
      return false;
    }
    let urlRegEx = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if (!urlRegEx.test(jiraCredentials.projectUrl)) {
      return false;
    }
    return true;
  }

  // refetch data from back
  resetCredentials() {
    if (!this.entitySettings.entityId || this.entitySettings.entityId.substring(0,1) === '0') {
      this.orgService.getOrgSettings().subscribe(
        data => {
            this.entitySettings = data.data.orgSettings;
            if (!this.entitySettings) {
              this.entitySettings = new EntitySettings();
              this.entitySettings.entityId = this.entityId;
            }
            if (!this.entitySettings.jiraCredentials) {
              this.entitySettings.jiraCredentials = new JiraCredentials();
            }
                },
        error => {
            this.entitySettings = new EntitySettings();
            this.entitySettings.entityId = this.entityId;
            this.entitySettings.jiraCredentials = new JiraCredentials();
            console.error("JiraCredentialsComponent", error);
        }
      );
    } else {
      this.entityService.getEntitySettings(this.entitySettings.entityId).subscribe(
        data => {
            this.entitySettings = data.data.entity.entitySettings;
            if (!this.entitySettings) {
              this.entitySettings = new EntitySettings();
              this.entitySettings.entityId = this.entityId;
            }
            if (!this.entitySettings.jiraCredentials) {
              this.entitySettings.jiraCredentials = new JiraCredentials();
            }
        },
        error => {
            this.entitySettings = new EntitySettings();
            this.entitySettings.entityId = this.entityId;
            this.entitySettings.jiraCredentials = new JiraCredentials();            
            console.error("JiraCredentialsComponent", error);
        }
      );
    }
  }

}
