import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ApiKey, Message, Messages, User} from "@app/models";
import { OrgService } from '@app/services/org.service';
import { UserService } from '@app/services/user.service';
import { UserUtils } from '../user-utils';

@Component({
    selector: 'app-api-key-edit',
    templateUrl: './apikey-edit.component.html',
    styleUrls: ['./apikey-edit.component.scss']
})
export class ApiKeyEditComponent extends UserUtils implements OnInit {

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
        private orgService: OrgService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.keyId = this.route.snapshot.paramMap.get('keyid');
        this.username = this.route.snapshot.paramMap.get('username');
        this.isUserKey = !!this.username
        if (this.isUserKey) {
            let userData = this.userService.getUser(this.username).subscribe(
                data => {
                    this.user = data.data.user;
                },
                error => {
                    console.error("ApiKeyEditComponent", error);
                }
            );
        }
        if (this.keyId === 'new') {
            this.apiKey = new ApiKey();
            this.apiKey.username = this.username;
        } else {
            let getApiKeyObservable=undefined;
            if (this.isUserKey) { //user key
                getApiKeyObservable = this.userService.getApiKey(this.username, this.keyId);
            } else { // org key
                getApiKeyObservable = this.orgService.getOrgApiKey(this.keyId);
            }
            getApiKeyObservable.subscribe(
                data => {
                    this.apiKey = data.data.apiKey;
                    if (!this.apiKey) {
                        this.apiKey = undefined;
                        console.error("ApiKeyEditComponent", "API key is not found");
                    }
                },
                error => {
                    this.apiKey = undefined;
                    console.error("ApiKeyEditComponent", error);
                }
            );
        }
    }   

    saveApiKey() {
        let messages: Message[] = this.validateApiKey();
        if (messages.length>0) {
            this.messages = messages;
            return;
        }
        if (this.keyId === 'new') {
            let generateApiKeyObservable=undefined;
            let successLink = undefined;
            if (this.isUserKey) {  // user key
                generateApiKeyObservable = this.userService.generateApiKey(this.apiKey);    
                successLink = '/admin/show/'+this.username+'/show/apikey/'
            } else { // org key
                generateApiKeyObservable = this.orgService.generateOrgApiKey(this.apiKey);    
                successLink = '/dashboard/org-setting/integration/org-apikeys/show/apikey/'
            }
            generateApiKeyObservable.subscribe((data:any) => {
                if (!!data && !!data.data) {
                    const link = successLink+data.data.generateApiKey.keyId;
                    this.router.navigate([link],
                        {state: {messages: [Message.success("API key generated successfully.")]}});
                }
            }, (error) => {
                console.error('API key generating', error);
                this.messages = [Message.error("Unexpected error occurred while trying to generate API key.")];
            });
        } else {
            let updateApiKeyObservable=undefined;
            let successLink = undefined;
            if (this.isUserKey) {  // user key
                updateApiKeyObservable = this.userService.updateApiKey(this.apiKey);
                successLink = '/admin/show/'+this.username+'/show/apikey/';
            } else { // org key
                updateApiKeyObservable = this.orgService.updateOrgApiKey(this.apiKey);
                successLink = '/dashboard/org-setting/integration/org-apikeys/show/apikey/'
            }
            updateApiKeyObservable.subscribe((data:any) => {
                if (!!data && !!data.data) {
                    const link = successLink+data.data.updateApiKey.keyId;
                    this.router.navigate([link],
                        {state: {messages: [Message.success("API key saved successfully.")]}});
                }
            }, (error) => {
                console.error('API key saving', error);
                this.messages = 
                    [Message.error("Unexpected error occurred while trying to save API key.")];
            });

        }    
    }

    // validate API key
    validateApiKey(): Message[] {
        let resMessages: Message[] = [];
        if (!this.apiKey.title) {
            resMessages.push(Message.error("API key title field is required."));
        }
        return resMessages;
    }

    // navigate to organization settings
    goToOrgSettings() {
        this.router.navigateByUrl('dashboard/org-setting/integration/org-apikeys');        
    }

    gotoUser() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": this.username
            }
        };
        this.router.navigate(['/admin/user/show'], navigationExtras);
    }
}
