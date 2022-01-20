import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {JiraService} from "@app/services/jira.service";

@Component({
    selector: 'app-create-jira-ticket',
    templateUrl: './create-jira-ticket.component.html',
    styleUrls: ['./create-jira-ticket.component.scss']
})
export class CreateJiraTicketComponent implements OnInit {
    content: string;
    scanId;
    orgId;
    projectId;

    // For vulnerabilities
    vulnerabilityId;
    vulnId;

    // For Licenses
    licenseId;

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private spinner: NgxSpinnerService,
        private jiraService: JiraService
    ) {
    }

    ngOnInit() {
    }

    closeBtn() {
        this.activeModal.close();
    }

    createJiraTicket() {
        console.log("Create jira content: " + this.content);
        this.spinner.show();
        if (this.vulnId && this.vulnerabilityId) {
            this.jiraService
                .createVulnerabilityJiraTicket(this.vulnerabilityId, this.projectId, this.scanId, this.orgId, this.vulnId, this.content)
                .subscribe(({data}) => {
                    this.successTicketCreation(data);
                });
        } else if (this.licenseId) {
            this.jiraService
                .createLicenseJiraTicket(this.licenseId, this.projectId, this.scanId, this.orgId, this.content)
                .subscribe(({data}) => {
                    this.successTicketCreation(data);
                });
        }
    }

    successTicketCreation(data) {
        console.log("Jira data: " + data);
        this.spinner.hide();
        this.activeModal.close();
        window.location.reload();
    }
}
