import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})

export class ProjectSettingsComponent implements OnInit {

  tabDetails: any = [];
  activeTabId: string = "alerts";
  constructor(private location: Location) {
  }

  ngOnInit(): void {
    this.tabDetails = [
      {
        tabName: "Alerts",
        tabId: "alerts",
        isActive: true
      },
      {
        tabName: "Threat Agent Configuration",
        tabId: "threatagentconfiguration",
        isActive: false
      },
      {
        tabName: "User Management",
        tabId: "usermanage",
        isActive: false
      },
    ]
  }

  onClickTab(item) {
    this.tabDetails.forEach(tab => {
        if (tab.tabId == item.tabId) {
            tab.isActive = true;
        } else {
            tab.isActive = false;
        }
    });
    this.activeTabId = item.tabId;
  }

  back() {
    this.location.back();
  }
}  