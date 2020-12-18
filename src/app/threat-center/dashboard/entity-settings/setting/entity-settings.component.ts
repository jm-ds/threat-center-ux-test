import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-entity-settings',
  templateUrl: './entity-settings.component.html',
  styleUrls: ['./entity-settings.component.scss']
})

export class EntitySettingsComponent implements OnInit {
  tabDetails: any = [];
  activeTabId: string = "alerts";
  constructor() {

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
}  