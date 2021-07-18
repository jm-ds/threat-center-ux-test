import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { OrgService } from '@app/admin/services/org.service';
import { UserService } from '@app/admin/services/user.service';
import { AlertService } from '@app/core/services/alert.service';
import {ApiKey, Message, Messages, User} from "@app/models";
import { UserUtils } from '../user-utils';

@Component({
    selector: 'app-api-key',
    templateUrl: './apikey-show.component.html',
    styleUrls: ['./apikey-show.component.scss']
})
export class ApiKeyShowComponent extends UserUtils implements OnInit {

    messages: Messages;
    keyId: string;
    username: string;
    apiKey: ApiKey;
    user: User;
    isUserKey: boolean = true;


    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
        private alertService:AlertService,
        private orgService: OrgService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.keyId = this.route.snapshot.paramMap.get('keyid');
        this.username = this.route.snapshot.paramMap.get('username');
        this.isUserKey = !!this.username
        let getApiKeyObservable=undefined;
        if (this.isUserKey) { // user key
            this.userService.getUser(this.username).subscribe(
                data => {
                    this.user = data.data.user;
                },
                error => {
                    console.error("ApiKeyShowComponent", error);
                }
            );
            getApiKeyObservable = this.userService.getApiKey(this.username, this.keyId);
        } else { // org key
            getApiKeyObservable = this.orgService.getOrgApiKey(this.keyId);
        }
        getApiKeyObservable.subscribe(
            data => {
                this.apiKey = data.data.apiKey;
                if (!this.apiKey) {
                    this.apiKey = undefined;
                    console.error("ApiKeyShowComponent", "API key is not found");
                }
            },
            error => {
                this.apiKey = undefined;
                console.error("ApiKeyShowComponent", error);
            }
        );
    }   


    // remove API key
    removeApiKey() {
        if (confirm("Are you sure you want to delete API key?")) {
            let removeApiKeyObservable=undefined;
            let successLink = undefined;
            if (this.isUserKey) { // user key
                removeApiKeyObservable = this.userService.removeApiKey(this.apiKey);    
                successLink = '/admin/user/show/'+this.username;
            } else { // org key
                removeApiKeyObservable = this.orgService.removeOrgApiKey(this.apiKey);    
                successLink = '/dashboard/org-setting/integration/org-apikeys'
            }
            removeApiKeyObservable
                .subscribe(() => {
                    this.router.navigate([successLink],
                        {state: {messages: [Message.success("API key removed successfully.")]}});
                }, (error) => {
                    console.error('API key Removing', error);
                    this.messages = [Message.error("Unexpected error occurred while trying to remove API key.")];
                });
        }
    }     

    
    // Copy API key to clipboard
    copyKey() {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = this.apiKey.apiKey;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this.alertService.alertBox('API key copied to clipboard!','API key!','success');
    }

    // navigate to organization settings
    goToOrgSettings() {
        this.router.navigateByUrl('dashboard/org-setting/integration/org-apikeys');        
    }    
}
