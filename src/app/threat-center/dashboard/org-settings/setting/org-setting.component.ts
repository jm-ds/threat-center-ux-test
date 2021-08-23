import { ViewEncapsulation } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    activePanelId: string = "Configuration";
    activeLink: string = "Threat Agent Configuration";
    activeIntegrationTabId: string = undefined;
    public orgSettings: EntitySettings;

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
        },
        {
            tabName: "API keys",
            tabId: "org-apikeys",
            isActive: false
        }
    ];

    accordianDetails = [
        // {
        //     panelId: "configuration",
        //     panelName: "Threat Agent Configuration",
        //     panelList: [],
        //     panelIcon:"fas fa-cog"
        // },
        // {
        //     panelId: "saml",
        //     panelName: "SAML Integration",
        //     panelList: []
        // },
        {
            panelId: "integration",
            panelName: "Integration",
            panelList: this.panelIntegration,
            panelIcon: "fas fa-bars"
        }
    ];

    constructor(
        private orgService: OrgService,
        private route: ActivatedRoute,
        protected router: Router
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
                this.calcActivePanel();
            },
            error => {
                this.orgSettings = undefined;
                console.error("OrganizationSettingComponent", error);
            }
        );

    }

    calcActivePanel() {
        let panelId = this.route.snapshot.paramMap.get('activePanelId') || "integration";
        if (!!panelId) {
            this.activePanelId = panelId;
        }
        let tabId = this.route.snapshot.paramMap.get('activeTabId');
        if (!!tabId) {
            this.activeIntegrationTabId = tabId;
        } else {
            this.activeIntegrationTabId = 'email';
        }
        let panel = this.getPanel(this.activePanelId);
        if (!!panel && !!panel.panelList) {
            let tab = this.getTab(panel.panelList, this.activeIntegrationTabId)
            this.setActiveTab(panel.panelList, tab);
        }
        this.setActivePanel(this.activePanelId);
    }

    beforeChange(event) {
        if (event.nextState) {
            this.setActivePanel(event.panelId);
        }
    }

    // get panel data by id
    getPanel(panelId) {
        return this.accordianDetails.find(p=>p.panelId == panelId);
    }

    // get tab data by id
    getTab(tabArray, tabId) {
        return tabArray.find(p=>p.tabId == tabId);
    }

    // set active panel by id
    setActivePanel(panelId) {
        this.activePanelId = panelId;
        switch (panelId) {
            case "configuration": {
                this.activeLink = "Threat Agent Configuration";
                this.activeIntegrationTabId = undefined;
                break;
            }
            case "saml": {
                this.activeLink = "Saml";
                this.activeIntegrationTabId = undefined;
                break;
            }
            case "integration": {
                const tabInfo = !!this.panelIntegration.find(f => f.isActive) ? this.panelIntegration.find(f => f.isActive): undefined;
                this.activeIntegrationTabId = tabInfo.tabId;
                this.activeLink = !!tabInfo ? tabInfo.tabName : '';
                break;
            }
        }
        this.navigate();
    }

    // set url by active panel and tab id
    navigate() {
        let newRoute = this.router.url.substr(0,this.router.url.lastIndexOf("org-setting")+11)+"/"+this.activePanelId;
        if (!!this.activeIntegrationTabId) {
            newRoute = newRoute+"/"+this.activeIntegrationTabId;
        }
        this.router.navigate([newRoute], { replaceUrl: true });
    }

    onClickTab(panelArray, item) {
        if (!!panelArray && panelArray.length >= 1) {
            this.setActiveTab(panelArray, item);
            this.navigate();
        }
    }

    // set active tab
    setActiveTab(panelArray, item) {
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