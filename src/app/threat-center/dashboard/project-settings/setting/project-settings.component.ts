import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})

export class ProjectSettingsComponent implements OnInit {

  activeTabId: string = "Alerts";
  activeLink: string = "alerts";
  panelAlerts = [
    {
      tabName: "Alerts",
      tabId: "threatagentconfiguration",
      isActive: true
    },
    {
      tabName: "Test 1",
      tabId: "test1",
      isActive: false
    }
  ];

  panelConfiguration = [
    {
      tabName: "Threat Agent Configuration",
      tabId: "threatagentconfiguration",
      isActive: true
    }
  ];

  panelUserManage = [
    {
      tabName: "User Management",
      tabId: "usermanage",
      isActive: true
    }
  ];

  constructor(private location: Location) {
  }

  beforeChange(event) {
    this.activeTabId = event.panelId;
    if (event.nextState) {
      switch (event.panelId) {
        case "Configuration": {
          this.activeLink = !!this.panelConfiguration.find(f => f.isActive) ? this.panelConfiguration.find(f => f.isActive).tabName : '';
          break;
        }
        case "Alerts": {
          this.activeLink = !!this.panelAlerts.find(f => f.isActive) ? this.panelAlerts.find(f => f.isActive).tabName : '';
          break;
        }
        case "UserManagement": {
          this.activeLink = !!this.panelUserManage.find(f => f.isActive) ? this.panelUserManage.find(f => f.isActive).tabName : '';
          break;
        }
      }
    }
  }

  ngOnInit(): void {
  }

  onClickTab(panelArray, item) {
    panelArray.forEach(tab => {
      if (tab.tabId == item.tabId) {
        tab.isActive = true;
      } else {
        tab.isActive = false;
      }
    });
    this.activeLink = item.tabName;

  }

  back() {
    this.location.back();
  }
}  