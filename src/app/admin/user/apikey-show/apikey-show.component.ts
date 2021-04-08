import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { UserService } from '@app/admin/services/user.service';
import {ApiKey, Message, Messages, User} from "@app/models";
import Swal from 'sweetalert2';
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
        this.userService.getUser(this.username).subscribe(
            data => {
                this.user = data.data.user;
            },
            error => {
                console.error("ApiKeyShowComponent", error);
            }
        );
        this.userService.getApiKey(this.username, this.keyId).subscribe(
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
            this.userService.removeApiKey(this.apiKey)
                .subscribe(() => {
                    const link = '/admin/user/show/'+this.username;
                    this.router.navigate([link],
                        {state: {messages: [Message.success("API key removed successfully.")]}});
                }, (error) => {
                    console.error('API key Removing', error);
                    const link = '/admin/user/show/'+this.username+'/create/apikey/'+ this.keyId;
                    this.router.navigate([link],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to remove API key.")]}});
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
        Swal.fire('API key!', 'API key copied to clipboard!', 'success');
    }
}
