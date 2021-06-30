import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { UserService } from '@app/admin/services/user.service';
import {ApiKey, ApiKeyRequestInput, Message, Messages, User} from "@app/models";
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

    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.keyId = this.route.snapshot.paramMap.get('keyid');
        this.username = this.route.snapshot.paramMap.get('username');
        let userData = this.userService.getUser(this.username).subscribe(
            data => {
                this.user = data.data.user;
            },
            error => {
                console.error("ApiKeyEditComponent", error);
            }
        );
        if (this.keyId === 'new') {
            this.apiKey = new ApiKey();
            this.apiKey.username = this.username;
        } else {
            this.userService.getApiKey(this.username, this.keyId).subscribe(
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
            this.userService.generateApiKey(this.apiKey).subscribe((data:any) => {
                if (!!data && !!data.data) {
                    const link = '/admin/show/'+this.username+'/show/apikey/'+data.data.generateApiKey.keyId;
                    this.router.navigate([link],
                        {state: {messages: [Message.success("API key generated successfully.")]}});
                }
            }, (error) => {
                console.error('API key generating', error);
                this.messages = 
                    [Message.error("Unexpected error occurred while trying to generate API key.")];
            });
        } else {
            this.userService.updateApiKey(this.apiKey).subscribe((data:any) => {
                if (!!data && !!data.data) {
                    const link = '/admin/show/'+this.username+'/show/apikey/'+data.data.updateApiKey.keyId;
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
}
