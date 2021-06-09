import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EntityService } from "@app/admin/services/entity.service";
import { EntitySettings } from "@app/models/entity";

@Component({
  selector: 'app-entity-settings',
  templateUrl: './entity-settings.component.html',
  styleUrls: ['./entity-settings.component.scss']
})

export class EntitySettingsComponent implements OnInit, AfterViewInit {
  public entityId: string;
  activeTabId: string = "Alerts";
  activeLink: string = "alerts";
  activeIntegrationTabId: string = undefined;
  public entitySettings: EntitySettings = new EntitySettings();

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

  panelIntegration = [
    {
        tabName: "Emails",
        tabId: "email",
        isActive: true
    },
    {
        tabName: "SLACK Integration",
        tabId: "slack",
        isActive: false
    },
    {
        tabName: "JIRA Integration",
        tabId: "jira",
        isActive: false
    }
];


  accordianDetails = [
    {
      panelId: "Integrations",
      panelName: "Integrations",
      panelList: this.panelIntegration,
      panelIcon:"fas fa-bars"
    },
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

  constructor(
        private route: ActivatedRoute,
        private entityService: EntityService
  ) {
  }

  ngOnInit(): void {
    this.entityId = this.route.snapshot.paramMap.get('entityId');
    this.entitySettings.entityId = this.entityId;
    this.entityService.getEntitySettings(this.entityId).subscribe(
      data => {
          this.entitySettings = data.data.entity.entitySettings;
      },
      error => {
          this.entitySettings = undefined;
          console.error("EntitySettingsComponent", error);
      }
    );

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
        case "Integrations": {
          const tabInfo = !!this.panelIntegration.find(f => f.isActive) ? this.panelIntegration.find(f => f.isActive): undefined;
          this.activeIntegrationTabId = tabInfo.tabId;
          this.activeLink = !!tabInfo ? tabInfo.tabName : '';
          break;
        }
      }
    }
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
      this.activeIntegrationTabId = item.tabId;
    }
  }
}  