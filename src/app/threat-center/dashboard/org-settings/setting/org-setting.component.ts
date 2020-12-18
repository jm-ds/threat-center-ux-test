import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-org-setting',
    templateUrl: './org-setting.component.html',
    styleUrls: ['./org-setting.component.scss']
})
export class OrganizationSettingComponent implements OnInit {

    tabDetails: any = [];
    activeTabId: string = "threatagentconfiguration";
    constructor(
    ) {
    }

    ngOnInit() {
        this.tabDetails = [
            {
                tabName: "Threat Agent Configuration",
                tabId: "threatagentconfiguration",
                isActive: true
            },
            {
                tabName: "SAML Integration",
                tabId: "samlIntegrations",
                isActive: false
            },
            {
                tabName: "Integrations",
                tabId: "integrations",
                isActive: false
            },
        ];
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