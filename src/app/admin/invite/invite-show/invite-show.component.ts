import {Component, OnInit} from '@angular/core';
import {Invite, InviteMailData, Message, Messages, } from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService } from '@app/core/services/alert.service';
import { InviteService } from '@app/services/invite.service';

@Component({
    selector: 'invite-view',
    templateUrl: './invite-show.component.html',
    styleUrls: ['./invite-show.component.scss']
})
export class InviteShowComponent implements OnInit {

    invite: Invite;
    inviteMailData: InviteMailData = new InviteMailData();
    messages: Messages;
    customMailSubject: boolean = false;
    customMailBody: boolean;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        private inviteService: InviteService,
        private alertService:AlertService
    ) {
        route.params.subscribe(val => {
            this.ngOnInit();
          });        
    }

    ngOnInit() {
        this.customMailBody = false;
        this.invite = null;
        const inviteHash = this.route.snapshot.paramMap.get('inviteHash');
        this.inviteService.getInvite(inviteHash).subscribe(
            data => {
                this.invite = data.data.getInvite;
            },
            error => {
                console.error("InviteShowComponent", error);
            }
        );
        this.getInviteMailData(inviteHash);
    }

    // fetch invite email data
    getInviteMailData(inviteHash) {
        this.inviteService.getInviteMailData(inviteHash).subscribe(
            data => {
                this.inviteMailData = data.data.getInviteMailData;
            },
            error => {
                console.error("InviteShowComponent", error);
            }
        );
    }

    // Copy Invite URL to clipboard
    copyInviteUrl() {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = this.invite.inviteUrl;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this.messages = [Message.success("Invite URL copied to clipboard.")];
    }


    customMailBodyChange() {
        this.customMailBody=!this.customMailBody;
        if (!this.customMailBody) {
            this.getInviteMailData(this.invite.inviteHash);
        }
    }

    customMailSubjectChange() {
        this.customMailSubject=!this.customMailSubject;
        if (!this.customMailSubject) {
            this.getInviteMailData(this.invite.inviteHash);
        }
    }


    // send invite email
    sendInviteMail() {
        if (!this.validateMailData()) {
            return;
        }
        this.inviteService.sendInviteMail(this.inviteMailData).subscribe(data => {
            const res = data.data.sendInviteMail;
            if (res) {
                this.alertService.alertBox('Invitation mail sent','Invite sending','success');
            }
        }, (error) => {
            console.error('Invite Mail', error);
            this.alertService.alertBox('Unexpected error occurred while trying to send invite email','Invite sending','error');
        });
    }

    // validate invite email data
    validateMailData() {
        if (!this.inviteMailData.to) {
            this.messages = [Message.error("Field To must be filled.")];
            return false;
        }
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(this.inviteMailData.to).toLowerCase())) {
            this.messages = [Message.error("Field To must be valid email address!")];
            return false;
        }
        return true;
    }
}
