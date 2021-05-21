import { ViewEncapsulation } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OrgService } from '@app/admin/services/org.service';
import { EntitySettings } from '@app/models';
import * as $ from 'jquery'

@Component({
    selector: 'app-org-setting',
    templateUrl: './org-setting.component.html',
    styleUrls: ['./org-setting.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [EntitySettings]
})
export class OrganizationSettingComponent implements OnInit, AfterViewInit {

    tabDetails: any = [];
    activeTabId: string = "Configuration";
    activeLink: string = "Threat Agent Configuration";
    activeIntegrationTabId: string = undefined;
    public orgSettings: EntitySettings = new EntitySettings();

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
        private orgService: OrgService
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
        this.orgService.getOrgSettings().subscribe(
            data => {
                this.orgSettings = data.data.orgSettings;
            },
            error => {
                this.orgSettings = undefined;
                console.error("OrganizationSettingComponent", error);
            }
        );
    }

    beforeChange(event) {
        this.activeTabId = event.panelId;
        if (event.nextState) {
            switch (event.panelId) {
                case "Configuration": {
                    this.activeLink = "Threat Agent Configuration";
                    this.activeIntegrationTabId = undefined;
                    break;
                }
                case "Saml": {
                    this.activeLink = "Saml";
                    this.activeIntegrationTabId = undefined;
                    break;
                }
                case "Integration": {
                    const tabInfo = !!this.panelIntegration.find(f => f.isActive) ? this.panelIntegration.find(f => f.isActive): undefined;
                    this.activeIntegrationTabId = tabInfo.tabId;
                    this.activeLink = !!tabInfo ? tabInfo.tabName : '';
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
            this.activeIntegrationTabId = item.tabId;
        }
    }
}