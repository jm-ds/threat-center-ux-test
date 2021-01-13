import { ViewEncapsulation } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery'

@Component({
    selector: 'app-org-setting',
    templateUrl: './org-setting.component.html',
    styleUrls: ['./org-setting.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrganizationSettingComponent implements OnInit, AfterViewInit {

    tabDetails: any = [];
    activeTabId: string = "Configuration";
    activeLink: string = "Threat Agent Configuration";

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

    accordianDetails = [
        {
            panelId: "Configuration",
            panelName: "Threat Agent Configuration",
            panelList: [],
            panelIcon:"fas fa-cog"
        },
        {
            panelId: "Saml",
            panelName: "SAML Integration",
            panelList: []
        },
        {
            panelId: "Integration",
            panelName: "Integration",
            panelList: this.panelIntegration,
            panelIcon: "fas fa-bars"
        }
    ];

    constructor(
    ) {
    }

    ngAfterViewInit(): void {
        this.accordianDetails.forEach(panel => {
            if (!!panel && panel.panelList.length == 0) {
                const aPanelId = "#" + panel.panelId + '-header';
                $(aPanelId).children('button').addClass('no-collapse');
            }
        });
    }

    ngOnInit() {
    }

    beforeChange(event) {
        this.activeTabId = event.panelId;
        if (event.nextState) {
            switch (event.panelId) {
                case "Configuration": {
                    this.activeLink = "Threat Agent Configuration";
                    break;
                }
                case "Saml": {
                    this.activeLink = "Saml";
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
}