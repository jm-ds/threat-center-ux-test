import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-org-setting',
    templateUrl: './org-setting.component.html',
    styleUrls: ['./org-setting.component.scss']
})
export class OrganizationSettingComponent implements OnInit {

    tabDetails: any = [];
    
    activeTabId: string = "Configuration";
    activeLink: string = "Threat Agent Configuration";

    panelConfiguration = [
        {
            tabName: "Threat Agent Configuration",
            tabId: "threatagentconfiguration",
            isActive: true
        },
        {
            tabName: "Test 1",
            tabId: "test1",
            isActive: false
        },
        {
            tabName: "Test2",
            tabId: "test2",
            isActive: false
        }
    ];
    panelSaml = [
        {
            tabName: "SAML",
            tabId: "saml",
            isActive: true
        },
    ];
    panelIntegration = [
        {
            tabName: "JIRA Integration",
            tabId: "jira",
            isActive: true
        },
        {
            tabName: "SLACK Integration",
            tabId: "slack",
            isActive: false
        }
    ];

    constructor(
    ) {
    }

    ngOnInit() {
    }

    beforeChange(event) {
        this.activeTabId = event.panelId;
        if (event.nextState) {
            switch (event.panelId) {
                case "Configuration": {
                    this.activeLink = !!this.panelConfiguration.find(f => f.isActive) ? this.panelConfiguration.find(f => f.isActive).tabName : '';
                    break;
                }
                case "Saml": {
                    this.activeLink = !!this.panelSaml.find(f => f.isActive) ? this.panelSaml.find(f => f.isActive).tabName : '';
                    break;
                }
                case "Integration": {
                    this.activeLink = !!this.panelIntegration.find(f => f.isActive) ? this.panelIntegration.find(f => f.isActive).tabName : '';
                    break;
                }
            }
        }
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
}