import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})

export class ProjectSettingsComponent implements OnInit, AfterViewInit {
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

  accordianDetails = [
    {
      panelId: "Alerts",
      panelName: "Alerts",
      panelList: this.panelAlerts,
      panelIcon: "fas fa-bars"
    },
    {
      panelId: "Configuration",
      panelName: "Threat Agent Configuration",
      panelList: [],
      panelIcon:"fas fa-cog"
    },
    {
      panelId: "UserManagement",
      panelName: "User Management",
      panelList: [],
      panelIcon:"fas fa-users"
    }
  ];

  constructor(private location:Location) {
  }

  beforeChange(event) {
    this.activeTabId = event.panelId;
    if (event.nextState) {
      switch (event.panelId) {
        case "Configuration": {
          this.activeLink = "Threat Agent Configuration";
          break;
        }
        case "Alerts": {
          this.activeLink = !!this.panelAlerts.find(f => f.isActive) ? this.panelAlerts.find(f => f.isActive).tabName : '';
          break;
        }
        case "UserManagement": {
          this.activeLink = "User Management";
          break;
        }
      }
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.accordianDetails.forEach(panel => {
      if (!!panel && panel.panelList.length == 0) {
        const aPanelId = "#" + panel.panelId + '-header';
        $(aPanelId).children('button').addClass('no-collapse');
      }
    });
  }

  onClickTab(panelArray, item) {
    if (!!panelArray && panelArray.length >= 1) {
      panelArray.forEach(tab => {
        if (tab.tabId == item.tabId) {
          tab.isActive = true;
        } else {
          tab.isActive = false;
        }
      });
      this.activeLink = item.tabName;
    }
  }
  back() {
    this.location.back();
  }
}  